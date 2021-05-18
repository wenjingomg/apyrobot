// const hecoAddress = 'http://127.0.0.1:26659'
const hecoAddress = 'https://http-mainnet.hoosmartchain.com'
// const hecoAddress = 'http://52.73.128.127:3100'

// 类型, 池子， 锁仓/交易额, 日化
const coins = [{"pid":0,"lpAddresses":"0xa1D8Ad964B9f83f9cE146C26E83f1e926B1b4E75","tokenAddresses":"0x80c6A3A493aFd7C52f89E6504C90cE6A639783FC","symbol":"iXT/iHOO","isLp":true},{"pid":1,"lpAddresses":"0x6eef1d0ECef5964a58518e7d3b5B38d95D0C8010","tokenAddresses":"0x09e6030537f0582d51C00bdC2d590031d9b1c86c","symbol":"iUSDT/iXT","isLp":true},{"pid":2,"lpAddresses":"0x9755b9E87351B91304B2388054541Affa22BD649","tokenAddresses":"0x80c6A3A493aFd7C52f89E6504C90cE6A639783FC","symbol":"iXT/iUSDC","isLp":true},{"pid":3,"lpAddresses":"0x647B34b16D43F50c490F9B2EA5a1258279A07CBd","tokenAddresses":"0x09e6030537f0582d51C00bdC2d590031d9b1c86c","symbol":"iUSDT/iHOO","isLp":true},{"pid":4,"lpAddresses":"0x862F8295cFe48f32E36150F2A7b6D2CE5AA12da3","tokenAddresses":"0xBB34708E4E1501A88A357C2F7f68edBa9ad9C35E","symbol":"iHOO/iETH","isLp":true},{"pid":5,"lpAddresses":"0x7f7Aaaeee831f249AeA23F381fF8A073c833E60C","tokenAddresses":"0x89C7304A425f07E6B71d849b835CBB92dd02C609","symbol":"iBTC/iHOO","isLp":true},{"pid":6,"lpAddresses":"0xCc5E1D98b4099FCfbBdd7183D425fc427a34b83b","tokenAddresses":"0x082Afe9ce9863D707788cc2751AEB52f99f687df","symbol":"iBCH/iXT","isLp":true},{"pid":7,"lpAddresses":"0x4444Ce8c7975342CbEb799C823DA0EdDf8308281","tokenAddresses":"0x80c6A3A493aFd7C52f89E6504C90cE6A639783FC","symbol":"iXT/iLTC","isLp":true},{"pid":8,"lpAddresses":"0x19F68FD3e2e99D7a1Ad8b19437791Bf3bB7Ed64a","tokenAddresses":"0x80c6A3A493aFd7C52f89E6504C90cE6A639783FC","symbol":"iXT/iDOGE","isLp":true},{"pid":9,"lpAddresses":"0xb187E302632168F2A53A1af6B3F0235c6e70bDAf","tokenAddresses":"0x1DF29bD08647578A24DEe96329994a1e7C12e407","symbol":"iDOT/iXT","isLp":true},{"pid":10,"lpAddresses":"0xcF655875E66E067466C1c93D1a7eD1E23B4429D2","tokenAddresses":"0x756968a917881579eD1a3375cE67596d1C5f266f","symbol":"iEOS/iXT","isLp":true},{"pid":11,"lpAddresses":"0x37dB3170CDC957d8D15722f085DCA3b3b7c90c46","tokenAddresses":"0x4aa83f492d8A8E3a6fA5D9Be4609073b65b12583","symbol":"iETC/iXT","isLp":true},{"pid":12,"lpAddresses":"0x880B15a7B2907cfdA86eCdCa60eC00C680BBf2fd","tokenAddresses":"0x752eD57ED9B838b5FAAd298886496Fbd678A9e46","symbol":"iBNB/iXT","isLp":true},{"pid":13,"lpAddresses":"0xD77f15e0270b32ee7BA87b096403b8DE5aCB45EC","tokenAddresses":"0x80c6A3A493aFd7C52f89E6504C90cE6A639783FC","symbol":"iXT/iFIL","isLp":true},{"pid":14,"lpAddresses":"0x9f358c40d2078A665e6fdfb91671353a616fc657","tokenAddresses":"0x80c6A3A493aFd7C52f89E6504C90cE6A639783FC","symbol":"iXT/iUNI","isLp":true},{"pid":15,"lpAddresses":"0x0aC1902dc24a730F402bF3e85ebCA3a0223b138D","tokenAddresses":"0x1751f0B15d493c5e92587F5fcbaBbca84e7659E7","symbol":"iLINK/iXT","isLp":true},{"pid":16,"lpAddresses":"0xCDaCF47BAfbC0b9fAE7dcca3AD1f71840A178170","tokenAddresses":"0x1fc55b38750EA2892a64fb5fB487671CdcbCc0C2","symbol":"iKSM/iXT","isLp":true}]

//address
const oracleAddress = '0xeE32aF7595397684B79a88B02282de81169a58AC'
const usdtAddress = '0x09e6030537f0582d51C00bdC2d590031d9b1c86c'
const chefAddress = '0x7B9a9f3fAcB02590E9A44F4d3E21584689911bD7'
const mdxAddress = '0x80c6A3A493aFd7C52f89E6504C90cE6A639783FC'
const mingingPoolAddress = '0xa944735DFDA74FE3dc94558B6559777e2438358A'
const USDT_DECIMAL = 18

const tokens = {"0x80c6A3A493aFd7C52f89E6504C90cE6A639783FC":"iXT","0xBB34708E4E1501A88A357C2F7f68edBa9ad9C35E":"iHOO","0x09e6030537f0582d51C00bdC2d590031d9b1c86c":"iUSDT","0xeC95E2380EAd5D2AAB4C171a9A5D8A08b6aB5f04":"iUSDC","0xC7a434Cbf6B3acF148632232d06e35d04CE51871":"iETH","0x89C7304A425f07E6B71d849b835CBB92dd02C609":"iBTC","0x082Afe9ce9863D707788cc2751AEB52f99f687df":"iBCH","0xA9734F7aa7e00784789Dd773f489A6aB2c492102":"iLTC","0xc0b91a7905AF52012bb3E433f3136F726ABE0b3B":"iDOGE","0x1DF29bD08647578A24DEe96329994a1e7C12e407":"iDOT","0x756968a917881579eD1a3375cE67596d1C5f266f":"iEOS","0x4aa83f492d8A8E3a6fA5D9Be4609073b65b12583":"iETC","0x752eD57ED9B838b5FAAd298886496Fbd678A9e46":"iBNB","0xB8b98599c84D74265b85C530A9615E0583D45F61":"iFIL","0xb163F8061df0abc91eB45Fb6adB0f7022416D342":"iUNI","0x1751f0B15d493c5e92587F5fcbaBbca84e7659E7":"iLINK","0x1fc55b38750EA2892a64fb5fB487671CdcbCc0C2":"iKSM"}

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
  if(tokenSymbol == 'USDT' || tokenSymbol == 'USDK' ||  tokenSymbol == 'USDC' ||  tokenSymbol == 'BUSD' ||  tokenSymbol == 'DAI' || tokenSymbol == 'iUSDT') {
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
  if(tokenSymbol == 'USDT' || tokenSymbol == 'USDK' ||  tokenSymbol == 'USDC' ||  tokenSymbol == 'BUSD' ||  tokenSymbol == 'DAI' || tokenSymbol == 'iUSDT') {
    price = 1
  } else {
    try {
        price = await orcalContract.methods.consult(tokenAddresses, String(Math.pow(10, decimal)), usdtAddress).call()
    } catch (error) {
        console.log(tokenSymbol, 'get price', error)
    }
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
    var poolInfo = await miningPoolContract.methods.poolInfo(i).call();
    const poolWeight = poolInfo.allocPoint/totalAllocPoint
    let pairContract = new provider.eth.Contract(pairAbi, poolInfo.pair)
    let token0 = await pairContract.methods.token0().call()
    let token1 = await pairContract.methods.token1().call()
    const apy = mdxPrice*MINING_REWARD_PER_BLOCK*BLOCKS_PER_YEAR*poolWeight/(0.003*poolInfo.quantity)*100

    db.get('minging').push({
      id:i+1, 
      pool_id: i, 
      poolWeight,
      token0, 
      token1, 
      alloc_mdx_amt:poolInfo.allocMdxAmount/Math.pow(10, 18),
      total_quantity:poolInfo.totalQuantity/Math.pow(10, USDT_DECIMAL),
      pool_quantity:poolInfo.quantity/Math.pow(10, USDT_DECIMAL),
      alloc_point:poolInfo.allocPoint,
      apy, symbol0:tokens[token0], symbol1: tokens[token1], person_reward:'', person_quantity:''
    }).write()
  
  }
  db.set('time', new Date().toLocaleString()).write()  
}
getMiningPoolInfo()