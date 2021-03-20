// 类型, 池子， 锁仓/交易额, 日化
const coins = [
  {
    pid: 0,
    lpAddresses: '0x12Fc541d35f9F040C9C6233988144DFa5EB0986A', // 质押币地址 lpAddresses 统一用来查询余额，lp的话填写lp地址，单币的填币种地址
    tokenAddresses: '0x86936B61b490D2608F57A0b53aDE3eeF4cbD3EF9', // tokenAddresses,单币的话不需要，lp填要获取价格的币种地址
    symbol: 'STAR/USDT',
    islp: true
  },
  // {
  //   pid: 1,
  //   lpAddresses: '0x4164D61787eC20c7d46824aADFBc64EFF2BAF7d0', // lpAddresses 统一用来查询余额，lp的话填写lp地址，单币的填币种地址
  //   tokenAddresses: '0xd580f978c1F6Df02384f439662c7214f83cCcCf1', // tokenAddresses,单币的话不需要，lp填要获取价格的币种地址
  //   symbol: 'WOKT/USDT',
  //   islp: true
  // },
]
const hecoAddress = 'http://127.0.0.1:26659'

const web3 = require('web3')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./apy.json')
const db = low(adapter)
//address
const oracleAddress = '0x13Cfb993e03c9B89D437f2241D03eb6CA5de8ce2'
const usdtAddress = '0xe579156f9dEcc4134B5E3A30a24Ac46BB8B01281'
const chefAddress = '0x21eB9C39C4be10c6008AE13F2E25573dE2C10d41'
const mdxAddress = '0x86936B61b490D2608F57A0b53aDE3eeF4cbD3EF9'
const mingingPoolAddress = "0xe5B876BDbfAf8e4E317cEE76889b03eb60a05E99"

const tokens = {
  '0xDa9d14072Ef2262c64240Da3A93fea2279253611': 'OKB',
  '0xe579156f9dEcc4134B5E3A30a24Ac46BB8B01281': 'USDT',
  '0x533367b864D9b9AA59D0DCB6554DF0C89feEF1fF': 'USDK',
  '0x3e33590013B24bf21D4cCca3a965eA10e570D5B2': 'USDC',
  '0x09973e7e3914EB5BA69C7c025F30ab9446e3e4e0': 'BTCK',
  '0xDF950cEcF33E64176ada5dD733E170a56d11478E': 'ETHK',
  '0x72f8fa5da80dc6e20e00d02724cf05ebd302c35f': 'DOTK',
  '0xf6a0Dc1fD1d2c0122ab075d7ef93aD79F02CcB93': 'FILK',
  '0xd616388f6533B6f1c31968a305FbEE1727F55850': 'LTCK',
  '0x70c1c53E991F31981d592C2d865383AC0d212225': 'WOKT',
  // "0xE499Ef4616993730CEd0f31FA2703B92B50bB536": "HPT",
  // '0xae3a768f9aB104c69A7CD6041fE16fFa235d1810': 'HFIL',
  // '0x202b4936fE1a82A4965220860aE46d7d3939Bb25': 'AAVE',
  // '0x777850281719d5a96C29812ab72f822E0e09F3Da': 'SNX',
  // '0x22C54cE8321A4015740eE1109D9cBc25815C46E6': 'UNI',
}

//abi
const erc20Abi = require('./abi/erc20.json')
const oracleAbi = require('./abi/oracle.json')
const chefAbi = require('./abi/masterchef.json')
const pairAbi = require('./abi/pair.json')

// contract
const provider = new web3(hecoAddress)
const orcalContract = new provider.eth.Contract(oracleAbi, oracleAddress)
const chefContract = new provider.eth.Contract(chefAbi, chefAddress)
//
const BLOCKS_PER_YEAR = 10512000 //TODO
const SUSHI_PER_BLOCK = 27.3  //TODO

const getPoolWeight = async (pid) => {
  const { allocPoint } = await chefContract.methods.poolInfo(pid).call();
  const totalAllocPoint = await chefContract.methods
      .totalAllocPoint()
      .call();
  return allocPoint/totalAllocPoint;
};

const calculateCoin = async(lpAddresses, tokenSymbol, pid) => {
  const tokenContract = new provider.eth.Contract(erc20Abi, lpAddresses)
  const totalValue = await tokenContract.methods.balanceOf(chefAddress).call() 
  const decimal = await tokenContract.methods.decimals().call()
  if(tokenSymbol == 'USDT') {
    return {
      totalUsdtValue: totalValue/Math.pow(10, decimal),
      tokenPriceInWeth: 1,
      poolWeight: await getPoolWeight(pid)
    }
  } else {
    let price = 0
    try {
      price = await orcalContract.methods.consult(lpAddresses, String(Math.pow(10, decimal)), usdtAddress).call()
    } catch (error) {
      console.log(tokenSymbol, 'get price', error)
    }
    return {
      totalUsdtValue: totalValue/Math.pow(10, decimal)*price/Math.pow(10, 18),
      tokenPriceInUsdt: price/Math.pow(10, 18),
      poolWeight: await getPoolWeight(pid)
    }
  }
}

const calculateLp = async(lpAddresses, tokenAddresses, tokenSymbol, pid) => {
  const currentTokenContract = new provider.eth.Contract(pairAbi, lpAddresses)
  const currentLpContract = new provider.eth.Contract(erc20Abi, tokenAddresses)
  const totalSupply = await currentTokenContract.methods.totalSupply().call()
  console.log('lp totalSupply:', totalSupply)
  // chef的总量
  const balance = await currentTokenContract.methods.balanceOf(chefAddress).call()
  console.log('lp stake count:', balance)
  const decimal = await currentLpContract.methods.decimals().call()
  let price = 0
  try {
      price = await orcalContract.methods.consult(tokenAddresses, String(Math.pow(10, decimal)), usdtAddress).call()
  } catch (error) {
      console.log(tokenSymbol, 'get price', error)
  }
  //swap pair (BTC)总币数
  const tokenAmount = await currentLpContract.methods.balanceOf(currentTokenContract.options.address).call()
  console.log('tokenAmount:', tokenAmount)
  //质押池在swap pair的份额
  const portionLp = balance/totalSupply
  //质押池(BTC)总币数
  const totalAmount = tokenAmount*portionLp/Math.pow(10, decimal)
  const poolWeight = await getPoolWeight(pid)
  const token0addr = await currentTokenContract.methods.token0().call()
  const token1addr = await currentTokenContract.methods.token1().call()
  return {
      totalUsdtValue: totalAmount*price/Math.pow(10, 18)*2,
      tokenPriceInUsdt: price/Math.pow(10, 18),
      poolWeight,
      token0addr,
      token1addr
    }
}

const getCoinsInfo = async() => {
  const mdxPrice = await orcalContract.methods.consult(mdxAddress, String(Math.pow(10, 18)), usdtAddress).call()
  db.set('single', []).write()
  db.set('lps', []).write()
  for(const coin of coins) {
    let res = null
    if(coin.islp) {
      res = await calculateLp(coin.lpAddresses, coin.tokenAddresses, coin.symbol, coin.pid)
    } else {
      res = await calculateCoin(coin.lpAddresses, coin.symbol, coin.pid)
    }
    const apy = mdxPrice/1e+18*SUSHI_PER_BLOCK*BLOCKS_PER_YEAR*res.poolWeight/res.totalUsdtValue*100
    if(coin.islp) {
      db.get('lps').push({...res, symbol: coin.symbol, apy, lpAddresses:coin.lpAddresses, pid:coin.pid}).write()
    } else {
      db.get('single').push({...res, symbol: coin.symbol, apy, lpAddresses:coin.lpAddresses, pid:coin.pid}).write()
    }
  }
}
// getCoinsInfo()


//
const axios = require('axios')
const API_URL = 'https://api.mdex.com'
const moment = require('moment'); // require

const getApy = async() => {
  const list = await axios.get(`${API_URL}/pool/list`)
  const apys = await axios.get(`${API_URL}/pool/apys`)
  if(list.data.code == 0 && apys.data.code == 0) {
    db.set('minging', []).write()
    list.data.result.forEach(val => {
      db.get('minging').push({...val, apy: apys.data.result[val.pool_id], symbol0: tokens[val.token0], symbol1: tokens[val.token1]}).write()
    })
    const time = new Date().getTime()
    db.set('time', moment(time).utcOffset(8).format('YYYY-MM-DD HH:mm')).write()
  }
}
// getApy()

const mingingAbi = require('./abi/miningpool.json')
const MINING_REWARD_PER_BLOCK = 27.3 //TODO
const getMiningPoolInfo = async() => {
  const miningPoolContract = new provider.eth.Contract(mingingAbi, mingingPoolAddress)
  const poolLength = await miningPoolContract.methods.poolLength().call()
  const totalAllocPoint = await miningPoolContract.methods.totalAllocPoint().call()

  db.set('minging', []).write()
  for (i =0; i< poolLength; i++) {
    // {token0, token1, xtamount,totalQuantity,quantity, allocPoint} 
    var poolInfo = await miningPoolContract.methods.getPoolInfo(i).call();
    const poolWeight = poolInfo[5]/totalAllocPoint
    const token0 = poolInfo[0]
    const token1 = poolInfo[1]
    const apy = mdxPrice/1e+18*MINING_REWARD_PER_BLOCK*BLOCKS_PER_YEAR*poolWeight/(0.003*poolInfo[4])*100

    db.get('minging').push({
      id:i+1, 
      pool_id: i, 
      poolWeight,
      token0, 
      token1, 
      alloc_mdx_amt:poolInfo[2],
      total_quantity:poolInfo[3],
      pool_quantity:poolInfo[4],
      alloc_point:poolInfo[5],
      apy, symbol0: tokens[token0], symbol1: tokens[token1]
    }).write()
  
  }
  
}
getMiningPoolInfo()