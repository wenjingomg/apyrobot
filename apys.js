// const hecoAddress = 'http://127.0.0.1:26659'
const hecoAddress = 'https://http-testnet.hecochain.com'
// const hecoAddress = 'http://52.73.128.127:3100'

// 类型, 池子， 锁仓/交易额, 日化
const coins = [{"pid":0,"lpAddresses":"0xcF573Da28D8bdB96F4c0E45738b0B35AD40ef560","tokenAddresses":"0xeE3a7ECC8009c69B4a7c5595F1c5550C04bf8915","symbol":"USDT/XT","isLp":true}]

//address
const oracleAddress = '0x6153f39866D76f4DdfBFaB91E5FedEc7aBB3e2D2'
const usdtAddress = '0x04F535663110A392A6504839BEeD34E019FdB4E0'
const chefAddress = '0x102Bd46A5DeAb82840263897e1faa47052163Ce1'
const mdxAddress = '0xeE3a7ECC8009c69B4a7c5595F1c5550C04bf8915'
const mingingPoolAddress = "0x64EF70b98B7Cab4dD76cFCE253a6A6dd2160aE27"
const USDT_DECIMAL = 6

const tokens = {
  '0x1f3bFa9e6F5aB178958e14EbAF5D6D78F21993Ce': 'WHT',
  '0x04F535663110A392A6504839BEeD34E019FdB4E0': 'USDT',
  '0xa321ec942E6c8AC1FEE452bb3269Fb7Eb2B1D5bB': 'Multicall',
  "0xeE3a7ECC8009c69B4a7c5595F1c5550C04bf8915": "XT",
  // '0xae3a768f9aB104c69A7CD6041fE16fFa235d1810': 'HFIL',
  // '0x202b4936fE1a82A4965220860aE46d7d3939Bb25': 'AAVE',
  // '0x777850281719d5a96C29812ab72f822E0e09F3Da': 'SNX',
  // '0x22C54cE8321A4015740eE1109D9cBc25815C46E6': 'UNI',
}

//
const BLOCKS_PER_YEAR = 8808938 //TODO
const SUSHI_PER_BLOCK = 1.5  //TODO

const web3 = require('web3')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./apy.json')
const db = low(adapter)

//abi
const erc20Abi = require('./abi/erc20.json')
const oracleAbi = require('./abi/oracle.json')
const chefAbi = require('./abi/masterchef.json')
const pairAbi = require('./abi/pair.json')

// contract
const provider = new web3(hecoAddress)
const orcalContract = new provider.eth.Contract(oracleAbi, oracleAddress)
const chefContract = new provider.eth.Contract(chefAbi, chefAddress)


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
  if(tokenSymbol == 'USDT' || tokenSymbol == 'USDK' ||  tokenSymbol == 'USDC') {
    return {
      totalUsdtValue: totalValue/Math.pow(10, decimal),
      tokenPriceInUsdt: 1,
      poolWeight: await getPoolWeight(pid),
      decimal
    }
  } else {
    let price = 0
    try {
      price = await orcalContract.methods.consult(lpAddresses, String(Math.pow(10, decimal)), usdtAddress).call()
    } catch (error) {
    }
    return {
      totalUsdtValue: totalValue/Math.pow(10, decimal)*price/Math.pow(10, USDT_DECIMAL),
      tokenPriceInUsdt: price/Math.pow(10, USDT_DECIMAL),
      poolWeight: await getPoolWeight(pid),
      decimal
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
  const totalUsdtValue= totalAmount*price/Math.pow(10, USDT_DECIMAL)*2
  const split = tokenSymbol.indexOf('/')

  return {
      totalUsdtValue,
      tokenPriceInUsdt: price/Math.pow(10, USDT_DECIMAL),
      lpPrice: tokenAmount/Math.pow(10, decimal)*price/Math.pow(10, USDT_DECIMAL)*2/totalSupply*Math.pow(10, 18),
      poolWeight,
      token0addr,
      token1addr,
      symbol0: tokenSymbol.substring(0, split),
      symbol1: tokenSymbol.substring(split+1, tokenSymbol.length)
    }
}

const getCoinsInfo = async() => {
  const mdxPrice = await orcalContract.methods.consult(mdxAddress, String(Math.pow(10, 18)), usdtAddress).call()
  db.set('single', []).write()
  db.set('lps', []).write()
  for(const coin of coins) {
    let res = null
    if(coin.isLp) {
      res = await calculateLp(coin.lpAddresses, coin.tokenAddresses, coin.symbol, coin.pid)
    } else {
      res = await calculateCoin(coin.lpAddresses, coin.symbol, coin.pid)
    }
    const apy = mdxPrice/Math.pow(10, USDT_DECIMAL)*SUSHI_PER_BLOCK*BLOCKS_PER_YEAR*res.poolWeight/res.totalUsdtValue*100
    if(coin.isLp) {
      db.get('lps').push({...res, symbol: coin.symbol, apy, lpAddresses:coin.lpAddresses, pid:coin.pid}).write()
    } else {
      db.get('single').push({...res, symbol: coin.symbol, apy, lpAddresses:coin.lpAddresses, pid:coin.pid}).write()
    }
  }
  db.set('time', new Date().toLocaleString()).write()  
}
getCoinsInfo()


//
const axios = require('axios')
const moment = require('moment'); // require


const mingingAbi = require('./abi/miningpool.json')
const MINING_REWARD_PER_BLOCK = 1.5 //TODO
const getMiningPoolInfo = async() => {
  const mdxPrice = await orcalContract.methods.consult(mdxAddress, String(Math.pow(10, 18)), usdtAddress).call()
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
    const apy = mdxPrice*MINING_REWARD_PER_BLOCK*BLOCKS_PER_YEAR*poolWeight/(0.003*poolInfo[4])*100

    db.get('minging').push({
      id:i+1, 
      pool_id: i, 
      poolWeight,
      token0, 
      token1, 
      alloc_mdx_amt:poolInfo[2]/Math.pow(10, 18),
      total_quantity:poolInfo[3]/Math.pow(10, USDT_DECIMAL),
      pool_quantity:poolInfo[4]/Math.pow(10, USDT_DECIMAL),
      alloc_point:poolInfo[5],
      apy, symbol0:tokens[token0], symbol1: tokens[token1], person_reward:'', person_quantity:''
    }).write()
  
  }
  db.set('time', new Date().toLocaleString()).write()  
}
getMiningPoolInfo()