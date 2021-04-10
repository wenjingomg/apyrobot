// const hecoAddress = 'http://127.0.0.1:26659'
const hecoAddress = 'https://exchaintest.okexcn.com'
// const hecoAddress = 'http://52.73.128.127:3100'

// 类型, 池子， 锁仓/交易额, 日化
const coins = [{
  "pid": 0,
  "lpAddresses": "0xd1c0789E355D867fF133C88c77211A09aB833060",
  "tokenAddresses": "0x2698598b98175bB5d20f69063d5CD99514D63819",
  "symbol": "XT/USDT",
  "isLp": true
}, {
  "pid": 1,
  "lpAddresses": "0x13593B58738B31173a98402aC5077D4286dC9BF1",
  "tokenAddresses": "0x09973e7e3914EB5BA69C7c025F30ab9446e3e4e0",
  "symbol": "BTCK/XT",
  "isLp": true
}, {
  "pid": 2,
  "lpAddresses": "0xdb4AaA77E8b90e95bE2b038febDd02459222F856",
  "tokenAddresses": "0x2698598b98175bB5d20f69063d5CD99514D63819",
  "symbol": "XT/OKB",
  "isLp": true
}, {
  "pid": 3,
  "lpAddresses": "0x3CD27cBBADdCCD7e91C9F71955637eEbBd47B680",
  "tokenAddresses": "0x2698598b98175bB5d20f69063d5CD99514D63819",
  "symbol": "XT/ETHK",
  "isLp": true
}, {
  "pid": 4,
  "lpAddresses": "0x3EFa5b6620775cD9334a29736559f1e198E0E548",
  "tokenAddresses": "0x2698598b98175bB5d20f69063d5CD99514D63819",
  "symbol": "XT/WOKT",
  "isLp": true
}, {
  "pid": 5,
  "lpAddresses": "0x90994EB8aF4A82e2657ACd5e5CA86B378956D357",
  "tokenAddresses": "0x09973e7e3914EB5BA69C7c025F30ab9446e3e4e0",
  "symbol": "BTCK/USDT",
  "isLp": true
}, {
  "pid": 6,
  "lpAddresses": "0x31958B77EB55D23fe18823F15d070137CEbFF4F8",
  "tokenAddresses": "0xDF950cEcF33E64176ada5dD733E170a56d11478E",
  "symbol": "ETHK/USDT",
  "isLp": true
}, {
  "pid": 7,
  "lpAddresses": "0x81f4D6F37edce7737162b411617fb0Aea04Ec73E",
  "tokenAddresses": "0xDa9d14072Ef2262c64240Da3A93fea2279253611",
  "symbol": "OKB/USDT",
  "isLp": true
}, {
  "pid": 8,
  "lpAddresses": "0xDd22102698A574A28AFD80133715e8B81cCE3eC3",
  "tokenAddresses": "0xDa9d14072Ef2262c64240Da3A93fea2279253611",
  "symbol": "OKB/ETHK",
  "isLp": true
}, {
  "pid": 9,
  "lpAddresses": "0x9094493f729b68c1F18F471839920f3228c18399",
  "tokenAddresses": "0x09973e7e3914EB5BA69C7c025F30ab9446e3e4e0",
  "symbol": "BTCK/OKB",
  "isLp": true
}, {
  "pid": 10,
  "lpAddresses": "0xcb686638708DD442c8F8faf6fEEcdF5f6e4eb04C",
  "tokenAddresses": "0x70c1c53E991F31981d592C2d865383AC0d212225",
  "symbol": "WOKT/OKB",
  "isLp": true
}, {
  "pid": 11,
  "lpAddresses": "0x9db50c36ABc32faCc7b66a647E9183d9e503D614",
  "tokenAddresses": "0x70c1c53E991F31981d592C2d865383AC0d212225",
  "symbol": "WOKT/USDT",
  "isLp": true
}, {
  "pid": 12,
  "lpAddresses": "0xC73c9623fFA1DF6a0896d8A3E4aa240ECA15195a",
  "tokenAddresses": "0x70c1c53E991F31981d592C2d865383AC0d212225",
  "symbol": "WOKT/ETHK",
  "isLp": true
}, {
  "pid": 13,
  "lpAddresses": "0xE096CB4ea6b8c07bf562bf0CC810BcB94Dd6bceF",
  "tokenAddresses": "0x09973e7e3914EB5BA69C7c025F30ab9446e3e4e0",
  "symbol": "BTCK/WOKT",
  "isLp": true
}, {
  "pid": 14,
  "lpAddresses": "0x09973e7e3914EB5BA69C7c025F30ab9446e3e4e0",
  "tokenAddresses": "0x09973e7e3914EB5BA69C7c025F30ab9446e3e4e0",
  "symbol": "BTCK",
  "isLp": false
}, {
  "pid": 15,
  "lpAddresses": "0xDa9d14072Ef2262c64240Da3A93fea2279253611",
  "tokenAddresses": "0xDa9d14072Ef2262c64240Da3A93fea2279253611",
  "symbol": "OKB",
  "isLp": false
}, {
  "pid": 16,
  "lpAddresses": "0xDF950cEcF33E64176ada5dD733E170a56d11478E",
  "tokenAddresses": "0xDF950cEcF33E64176ada5dD733E170a56d11478E",
  "symbol": "ETHK",
  "isLp": false
}, {
  "pid": 17,
  "lpAddresses": "0x70c1c53E991F31981d592C2d865383AC0d212225",
  "tokenAddresses": "0x70c1c53E991F31981d592C2d865383AC0d212225",
  "symbol": "WOKT",
  "isLp": false
}, {
  "pid": 18,
  "lpAddresses": "0xe579156f9dEcc4134B5E3A30a24Ac46BB8B01281",
  "tokenAddresses": "0xe579156f9dEcc4134B5E3A30a24Ac46BB8B01281",
  "symbol": "USDT",
  "isLp": false
}, {
  "pid": 19,
  "lpAddresses": "0x3e33590013B24bf21D4cCca3a965eA10e570D5B2",
  "tokenAddresses": "0x3e33590013B24bf21D4cCca3a965eA10e570D5B2",
  "symbol": "USDC",
  "isLp": false
}, {
  "pid": 20,
  "lpAddresses": "0x533367b864D9b9AA59D0DCB6554DF0C89feEF1fF",
  "tokenAddresses": "0x533367b864D9b9AA59D0DCB6554DF0C89feEF1fF",
  "symbol": "USDK",
  "isLp": false
}, {
  "pid": 21,
  "lpAddresses": "0x72F8fa5da80dc6E20E00d02724cf05ebD302C35F",
  "tokenAddresses": "0x72F8fa5da80dc6E20E00d02724cf05ebD302C35F",
  "symbol": "DOTK",
  "isLp": false
}, {
  "pid": 22,
  "lpAddresses": "0xd616388f6533B6f1c31968a305FbEE1727F55850",
  "tokenAddresses": "0xd616388f6533B6f1c31968a305FbEE1727F55850",
  "symbol": "LTCK",
  "isLp": false
}]

//address
const oracleAddress = '0x26061dDaFC004E8510440E696e44C38Cc3F331ec'
const usdtAddress = '0xe579156f9dEcc4134B5E3A30a24Ac46BB8B01281'
const chefAddress = '0x04964cBB5E9410721dCb6bc0503C0B4E1D19ad48'
const mdxAddress = '0x2698598b98175bB5d20f69063d5CD99514D63819'
const mingingPoolAddress = "0x8413fc93D1a812A26fb38FD943D10fFA478F0254"
const USDT_DECIMAL = 10

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
  "0x2698598b98175bB5d20f69063d5CD99514D63819": "XT",
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