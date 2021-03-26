// const hecoAddress = 'http://127.0.0.1:26659'
const hecoAddress = 'https://exchaintest.okexcn.com'

// 类型, 池子， 锁仓/交易额, 日化
const coins = [
  {
    pid: 0,
    lpAddresses: '0x172a378B1aB64333bE2faa54C96476E5389F30AB', // 质押币地址 lpAddresses 统一用来查询余额，lp的话填写lp地址，单币的填币种地址
    tokenAddresses: '0xE5e399B4D0b721bD0B616E076e07E4416B78AA3E', // tokenAddresses,单币的话不需要，lp填要获取价格的币种地址
    symbol: 'XT/USDT',
    islp: true
  },
  {
    pid: 1,
    lpAddresses: '0x7B9A93174fC97d8CC42A632676C270FB25b80510', 
    tokenAddresses: '0xE5e399B4D0b721bD0B616E076e07E4416B78AA3E', 
    symbol: 'XT/BTCK',
    islp: true
  },
  {
    pid: 2,
    lpAddresses: '0x95c89c8F0506C1410F310b09B37D9cC1b5417BF9', 
    tokenAddresses: '0xE5e399B4D0b721bD0B616E076e07E4416B78AA3E', 
    symbol: 'XT/OKB',
    islp: true
  },
  {
    pid: 3,
    lpAddresses: '0xBd99824eB6DaaeC752151B75D1FD451F17A07434', 
    tokenAddresses: '0xE5e399B4D0b721bD0B616E076e07E4416B78AA3E', 
    symbol: 'XT/ETHK',
    islp: true
  },
  {
    pid: 4,
    lpAddresses: '0x554b9D5F5895a06E626527298A1634F82B330395', 
    tokenAddresses: '0xE5e399B4D0b721bD0B616E076e07E4416B78AA3E', 
    symbol: 'XT/OKT',
    islp: true
  },
  {
    pid: 5,
    lpAddresses: '0x48048fd8Fb1dD3Eb62BFB62cC21da359817AfaCD', 
    tokenAddresses: '0x09973e7e3914EB5BA69C7c025F30ab9446e3e4e0', 
    symbol: 'BTCK/USDT',
    islp: true
  },
  {
    pid: 6,
    lpAddresses: '0x41a7bf2CB1fe7FE6e718acc31C387a24f354C92F', 
    tokenAddresses: '0xDF950cEcF33E64176ada5dD733E170a56d11478E', 
    symbol: 'ETHK/USDT',
    islp: true
  },
  {
    pid: 7,
    lpAddresses: '0x6A8ed8f4aF0E80a4787018F7f20F8b90A4b62DB8', 
    tokenAddresses: '0xDa9d14072Ef2262c64240Da3A93fea2279253611', 
    symbol: 'OKB/USDT',
    islp: true
  },
  {
    pid: 8,
    lpAddresses: '0xF23E58F225E8Fb53fD8a564EC1A4D5D067025424', 
    tokenAddresses: '0xDa9d14072Ef2262c64240Da3A93fea2279253611', 
    symbol: 'OKB/ETHK',
    islp: true
  },
  {
    pid: 9,
    lpAddresses: '0xFd772dc34f78CAe86F4b66E3531249a794e102be', 
    tokenAddresses: '0xDa9d14072Ef2262c64240Da3A93fea2279253611', 
    symbol: 'OKB/BTCK',
    islp: true
  },
  {
    pid: 10,
    lpAddresses: '0x41439203945ef755CC53E0719e1C4eC0b01CF7F3', 
    tokenAddresses: '0xDa9d14072Ef2262c64240Da3A93fea2279253611', 
    symbol: 'OKB/OKT',
    islp: true
  },
  {
    pid: 11,
    lpAddresses: '0x2763233Cd2CA4A886b75047fE05663b45C985eb7', 
    tokenAddresses: '0x70c1c53E991F31981d592C2d865383AC0d212225', 
    symbol: 'OKT/USDT ',
    islp: true
  },
  {
    pid: 12,
    lpAddresses: '0x82F93401F603AFf80DF19A3EAd5D500dDA362213', 
    tokenAddresses: '0x70c1c53E991F31981d592C2d865383AC0d212225', 
    symbol: 'OKT/ETHK',
    islp: true
  },
  {
    pid: 13,
    lpAddresses: '0x5562dAF6F0bd0ed651Df008416D6C114E83e8221', 
    tokenAddresses: '0x70c1c53E991F31981d592C2d865383AC0d212225', 
    symbol: 'OKT/BTCK',
    islp: true
  },
  {
    pid: 14,
    lpAddresses: '0xE5e399B4D0b721bD0B616E076e07E4416B78AA3E', 
    tokenAddresses: '0xE5e399B4D0b721bD0B616E076e07E4416B78AA3E', 
    symbol: 'XT',
    islp: false
  },
  {
    pid: 15,
    lpAddresses: '0xe579156f9dEcc4134B5E3A30a24Ac46BB8B01281', 
    tokenAddresses: '0xe579156f9dEcc4134B5E3A30a24Ac46BB8B01281', 
    symbol: 'USDT',
    islp: false
  }
]

//address
const oracleAddress = '0x2619a22B1e399c473cC9A3C02FcEC826679F8D00'
const usdtAddress = '0xe579156f9dEcc4134B5E3A30a24Ac46BB8B01281'
const chefAddress = '0x1D256cFE65cBd73dF6a9bE499a4b3486a31D807E'
const mdxAddress = '0xE5e399B4D0b721bD0B616E076e07E4416B78AA3E'
const mingingPoolAddress = "0xe5B876BDbfAf8e4E317cEE76889b03eb60a05E99"
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
  "0xE5e399B4D0b721bD0B616E076e07E4416B78AA3E": "XT",
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
  if(tokenSymbol == 'USDT') {
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
  return {
      totalUsdtValue,
      tokenPriceInUsdt: price/Math.pow(10, USDT_DECIMAL),
      lpPrice: totalUsdtValue/totalSupply*Math.pow(10, 18),
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
    const apy = mdxPrice/Math.pow(10, USDT_DECIMAL)*SUSHI_PER_BLOCK*BLOCKS_PER_YEAR*res.poolWeight/res.totalUsdtValue*100
    if(coin.islp) {
      db.get('lps').push({...res, symbol: coin.symbol, apy, lpAddresses:coin.lpAddresses, pid:coin.pid}).write()
    } else {
      db.get('single').push({...res, symbol: coin.symbol, apy, lpAddresses:coin.lpAddresses, pid:coin.pid}).write()
    }
  }
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
      apy, symbol0:tokens[token0], symbol1: tokens[token1]
    }).write()
  
  }
  
}
getMiningPoolInfo()