// const hecoAddress = 'http://127.0.0.1:26659'
const hecoAddress = 'https://http-mainnet.hoosmartchain.com'
// const hecoAddress = 'http://52.73.128.127:3100'

// 类型, 池子， 锁仓/交易额, 日化
const coins = [{
	"pid": 0,
	"lpAddresses": "0x69cEE68Ae3ec433eb7C68B518102686ee409819B",
	"tokenAddresses": "0x3EFF9D389D13D6352bfB498BCF616EF9b1BEaC87",
	"symbol": "wHOO/XT",
	"isLp": true
}, {
	"pid": 1,
	"lpAddresses": "0x6d0Da1be8adCa6d5cCdaDD56E3c8968E6a0bD62E",
	"tokenAddresses": "0x5086FD78b1456Bde0A4b0e4E921334bb8CE1c6ff",
	"symbol": "XT/USDT",
	"isLp": true
}, {
	"pid": 2,
	"lpAddresses": "0xe5aDE94DA74A03d4B7a0D329d925251F04362b4c",
	"tokenAddresses": "0x5086FD78b1456Bde0A4b0e4E921334bb8CE1c6ff",
	"symbol": "XT/BTC",
	"isLp": true
}, {
	"pid": 3,
	"lpAddresses": "0x783d54ebE10f91A5CE42eA5484726190366c5340",
	"tokenAddresses": "0x5086FD78b1456Bde0A4b0e4E921334bb8CE1c6ff",
	"symbol": "XT/ETH",
	"isLp": true
}, {
	"pid": 4,
	"lpAddresses": "0x4aC4e6A1CB54c53F7548DC3D7413dCd369B18543",
	"tokenAddresses": "0x3EFF9D389D13D6352bfB498BCF616EF9b1BEaC87",
	"symbol": "wHOO/USDT",
	"isLp": true
}, {
	"pid": 5,
	"lpAddresses": "0x72E1B0E2bC36FFEE85d75737287B19F413Bfe6C3",
	"tokenAddresses": "0x3EFF9D389D13D6352bfB498BCF616EF9b1BEaC87",
	"symbol": "wHOO/ETH",
	"isLp": true
}, {
	"pid": 6,
	"lpAddresses": "0xb145Dd1a9bA34bd882dea598C5F7202912a2ea8b",
	"tokenAddresses": "0x3EFF9D389D13D6352bfB498BCF616EF9b1BEaC87",
	"symbol": "wHOO/BTC",
	"isLp": true
}, {
	"pid": 7,
	"lpAddresses": "0xaC4C077E093e792919d77e1DE088f6926c66A04A",
	"tokenAddresses": "0x5086FD78b1456Bde0A4b0e4E921334bb8CE1c6ff",
	"symbol": "XT/USDC",
	"isLp": true
}]


//address
const oracleAddress = '0xd67736d6F5544C0309562F3E857b2e6c15524AfF'
const usdtAddress = '0xD16bAbe52980554520F6Da505dF4d1b124c815a7'
const chefAddress = '0x456f160FA0eca0204a8bb3891c93e5db6C710492'
const mdxAddress = '0x5086FD78b1456Bde0A4b0e4E921334bb8CE1c6ff'
const mingingPoolAddress = "0x382bb67e1D0483e627f4224447C9b8BB67674D04"
const USDT_DECIMAL = 6

const tokens = {
	"0x3EFF9D389D13D6352bfB498BCF616EF9b1BEaC87": "wHOO",
	"0x5086FD78b1456Bde0A4b0e4E921334bb8CE1c6ff": "XT",
	"0xD16bAbe52980554520F6Da505dF4d1b124c815a7": "USDT",
	"0xAad9654a4df6973A92C1fd3e95281F0B37960CCd": "BTC",
	"0xA1588dC914e236bB5AE4208Ce3081246f7A00193": "ETH",
	"0x92a0bD4584c147D1B0e8F9185dB0BDa10B05Ed7e": "USDC"
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
  if(tokenSymbol == 'USDT' || tokenSymbol == 'USDK' ||  tokenSymbol == 'USDC' ||  tokenSymbol == 'BUSD' ||  tokenSymbol == 'DAI') {
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