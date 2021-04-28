// const hecoAddress = 'http://127.0.0.1:26659'
const hecoAddress = 'https://bsc-dataseed.binance.org'
// const hecoAddress = 'http://52.73.128.127:3100'

// 类型, 池子， 锁仓/交易额, 日化
const coins = [
  {
      "pid": 0,
      "lpAddresses": "0x55d398326f99059fF775485246999027B3197955",
      "tokenAddresses": "0x55d398326f99059fF775485246999027B3197955",
      "symbol": "USDT",
      "isLp": false
  },
  {
      "pid": 1,
      "lpAddresses": "0x73d60E2568bA1d2334C9654b8D50C2304c5bcDc7",
      "tokenAddresses": "0x40EB68Bc3B7fA9C2D4AE6a0298697641A65a9A31",
      "symbol": "XT/USDT",
      "isLp": true
  },
  {
      "pid": 2,
      "lpAddresses": "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
      "tokenAddresses": "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c",
      "symbol": "BTCB",
      "isLp": false
  },
  {
      "pid": 3,
      "lpAddresses": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      "tokenAddresses": "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      "symbol": "WBNB",
      "isLp": false
  },
  {
      "pid": 4,
      "lpAddresses": "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
      "tokenAddresses": "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
      "symbol": "ETH",
      "isLp": false
  },
  {
      "pid": 5,
      "lpAddresses": "0x55d398326f99059fF775485246999027B3197955",
      "tokenAddresses": "0x55d398326f99059fF775485246999027B3197955",
      "symbol": "USDT",
      "isLp": false
  },
  {
      "pid": 6,
      "lpAddresses": "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      "tokenAddresses": "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      "symbol": "BUSD",
      "isLp": false
  },
  {
      "pid": 7,
      "lpAddresses": "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      "tokenAddresses": "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      "symbol": "USDC",
      "isLp": false
  },
  {
      "pid": 8,
      "lpAddresses": "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402",
      "tokenAddresses": "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402",
      "symbol": "DOT",
      "isLp": false
  },
  {
      "pid": 9,
      "lpAddresses": "0x4338665CBB7B2485A8855A139b75D5e34AB0DB94",
      "tokenAddresses": "0x4338665CBB7B2485A8855A139b75D5e34AB0DB94",
      "symbol": "LTC",
      "isLp": false
  },
  {
      "pid": 10,
      "lpAddresses": "0xbA2aE424d960c26247Dd6c32edC70B295c744C43",
      "tokenAddresses": "0xbA2aE424d960c26247Dd6c32edC70B295c744C43",
      "symbol": "DOGE",
      "isLp": false
  },
  {
      "pid": 11,
      "lpAddresses": "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
      "tokenAddresses": "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3",
      "symbol": "DAI",
      "isLp": false
  }
]


//address
const oracleAddress = '0xd67736d6F5544C0309562F3E857b2e6c15524AfF'
const usdtAddress = '0x55d398326f99059fF775485246999027B3197955'
const chefAddress = '0x99F3AaC5502178F8fe1F3F1a3C463E1f3f841a55'
const mdxAddress = '0x40EB68Bc3B7fA9C2D4AE6a0298697641A65a9A31'
const mingingPoolAddress = "0xbfA6D5Fb24b3b9C1837bc8C0E6b2a0096CD72c9b"
const USDT_DECIMAL = 18

const tokens = {
  "0x40EB68Bc3B7fA9C2D4AE6a0298697641A65a9A31": "XT",
  "0x55d398326f99059fF775485246999027B3197955": "USDT"
}

//
const BLOCKS_PER_YEAR = 86400*365/3 
const SUSHI_PER_BLOCK = 1  
const MINING_REWARD_PER_BLOCK = 1 


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