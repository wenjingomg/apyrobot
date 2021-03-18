// 类型, 池子， 锁仓/交易额, 日化
const coins = [
  {
    pid: 0,
    lpAddresses: '0x3121A195330f8B3C6a006145FFD7F20c4c398134', // 质押币地址 lpAddresses 统一用来查询余额，lp的话填写lp地址，单币的填币种地址
    tokenAddresses: '0x2103c8E3C6aea0067F61337f8548f3B8a1653D1c', // tokenAddresses,单币的话不需要，lp填要获取价格的币种地址
    symbol: 'MDX/USDT',
    islp: true
  },
  {
    pid: 0,
    lpAddresses: '0x4164D61787eC20c7d46824aADFBc64EFF2BAF7d0', // lpAddresses 统一用来查询余额，lp的话填写lp地址，单币的填币种地址
    tokenAddresses: '0xd580f978c1F6Df02384f439662c7214f83cCcCf1', // tokenAddresses,单币的话不需要，lp填要获取价格的币种地址
    symbol: 'WOKT/USDT',
    islp: true
  },
]
const hecoAddress = 'http://127.0.0.1:26659'

const web3 = require('web3')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./apy.json')
const db = low(adapter)
//address
const oracleAddress = '0x1f0a6390B1D4cA8c4d89adEAC9Bb13efE017C558'
const usdtAddress = '0x550FB60524bc6115108289E1048757B81688e362'
const chefAddress = '0xBB38a2616A19bA08D45966e55e5774A7476d2951'
const mdxAddress = '0x2103c8E3C6aea0067F61337f8548f3B8a1653D1c'
//abi
const erc20Abi = require('./abi/erc20.json')
const oracleAbi = require('./abi/oracle.json')
const chefAbi = require('./abi/masterchef.json')
// contract
const provider = new web3(hecoAddress)
const orcalContract = new provider.eth.Contract(oracleAbi, oracleAddress)
const chefContract = new provider.eth.Contract(chefAbi, chefAddress)
//
const BLOCKS_PER_YEAR = 10512000
const SUSHI_PER_BLOCK = 27.3

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
  const currentTokenContract = new provider.eth.Contract(erc20Abi, lpAddresses)
  const currentLpContract = new provider.eth.Contract(erc20Abi, tokenAddresses)
  const totalSupply = await currentTokenContract.methods.totalSupply().call()
  console.log('lp totalSupply:', tokenAmount)
  // chef的总量
  const balance = await currentTokenContract.methods.balanceOf(chefAddress).call()
  console.log('lp stake count:', tokenAmount)
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
  return {
      totalUsdtValue: totalAmount*price/Math.pow(10, 18)*2,
      tokenPriceInUsdt: price/Math.pow(10, 18),
      poolWeight
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
      db.get('lps').push({...res, symbol: coin.symbol, apy, lpAddresses:coin.lpAddresses}).write()
    } else {
      db.get('single').push({...res, symbol: coin.symbol, apy, lpAddresses:coin.lpAddresses}).write()
    }
  }
}
getCoinsInfo()


//
const axios = require('axios')
const API_URL = 'https://api.mdex.com'
const moment = require('moment'); // require
const tokens = {
  '0x0298c2b32eaE4da002a15f36fdf7615BEa3DA047': 'HUSD',
  '0x5545153CCFcA01fbd7Dd11C0b23ba694D9509A6F': 'HT',
  '0x64FF637fB478863B7468bc97D30a5bF3A428a1fD': 'ETH',
  '0xa71EdC38d189767582C38A3145b5873052c3e47a': 'USDT',
  '0x66a79D23E58475D2738179Ca52cd0b41d73f0BEa': 'HBTC',
  '0x25D2e80cB6B86881Fd7e07dd263Fb79f4AbE033c': 'MDX',
  '0xa042fb0e60125A4022670014AC121931e7501Af4': 'BAG',
  '0xA2c49cEe16a5E5bDEFDe931107dc1fae9f7773E3': 'HDOT',
  '0xecb56cf772B5c9A6907FB7d32387Da2fCbfB63b4': 'HLTC',
  '0xeF3CEBD77E0C52cb6f60875d9306397B5Caca375': 'HBCH',
  "0xE499Ef4616993730CEd0f31FA2703B92B50bB536": "HPT",
  '0xae3a768f9aB104c69A7CD6041fE16fFa235d1810': 'HFIL',
  '0x202b4936fE1a82A4965220860aE46d7d3939Bb25': 'AAVE',
  '0x777850281719d5a96C29812ab72f822E0e09F3Da': 'SNX',
  '0x22C54cE8321A4015740eE1109D9cBc25815C46E6': 'UNI',
}
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