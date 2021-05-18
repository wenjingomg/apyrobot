const hecoAddress = 'https://http-mainnet.hoosmartchain.com'
// const hecoAddress = 'http://127.0.0.1:26659'

const TRANS_API =  'https://www.hscscan.com/v1/transaction/list'
const POOL_URL = 'http://35.174.61.1:3000/hsc/pool.json'
// const POOL_URL = 'http://54.162.86.58:3000/pool.json'

//address
const oracleAddress = '0xeE32aF7595397684B79a88B02282de81169a58AC'
const usdtAddress = '0x09e6030537f0582d51C00bdC2d590031d9b1c86c'
const chefAddress = '0x7B9a9f3fAcB02590E9A44F4d3E21584689911bD7'
const XT_ADDRESS = '0x80c6A3A493aFd7C52f89E6504C90cE6A639783FC'
const wethAddress = '0xBB34708E4E1501A88A357C2F7f68edBa9ad9C35E'
// const routerAddress = '0x92eA108F89a7c7bC1Fc9F3efC8c21Ac6020153Ae'
const routerOKAddress = '0x233E05c6Eb6be49254d70fE3C72270BA457AEff2'
const farmAddres = '0x7B9a9f3fAcB02590E9A44F4d3E21584689911bD7'
const farmOkAddress = '0x7B9a9f3fAcB02590E9A44F4d3E21584689911bD7'
const tradeMingingAddress = '0xa944735DFDA74FE3dc94558B6559777e2438358A'
const tradeMingingOKaddress = '0xa944735DFDA74FE3dc94558B6559777e2438358A'
const USDT_DECIMAL = 6
const TIME_ZONG_OFFSET = 0
const maxXTSupply = 100000000 * 1e18;

const web3 = require('web3')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./trans-config.json')
const db = low(adapter)
const transadapter = new FileSync('./trans.json')
const transdb = low(transadapter)

//abi
const erc20Abi = require('./abi/erc20.json')
const oracleAbi = require('./abi/oracle.json')
const chefAbi = require('./abi/masterchef.json')
const xtTokenAbi = require('./abi/XTToken.json')

// contract
const provider = new web3(hecoAddress)
const orcalContract = new provider.eth.Contract(oracleAbi, oracleAddress)
const chefContract = new provider.eth.Contract(chefAbi, chefAddress)


const getTransAgs = (input, id) => {
  if(id == 0) {
    return input.substring(0, 8)
  } else {
    return input.substr(8+(id-1)*64, 64)
  }
}

const parseAddr = (input) => {
  return '0x'+input.substr(24,40)
}


function hex2int(hex) {
      var len = hex.length, a = new Array(len), code;
      for (var i = 0; i < len; i++) {
          code = hex.charCodeAt(i);
          if (48<=code && code < 58) {
              code -= 48;
          } else {
              code = (code & 0xdf) - 65 + 10;
          }
          a[i] = code;
      }
      
      return a.reduce(function(acc, c) {
          acc = 16 * acc + c;
          return acc;
      }, 0);
}

//trans
const axios = require('axios')
// https://www.oklink.com/api/explorer/v1/okexchain_test/addresses/0x92eA108F89a7c7bC1Fc9F3efC8c21Ac6020153Ae/transactions/condition?t=1616233048813&limit=10&offset=0'
const doQueryTrans = async(addr, start, end,limit, page) => {
  const timestamp = new Date().getTime()
  let url = `${TRANS_API}?page=${page}&limit=100&direction=asc&sort=id&address=${addr}`
  // let url = `${TRANS_API}/${addr}/transactions/condition?t=${timestamp}&limit=${limit}&offset=${offset}&txType=contractCall&start=${start}&end=${end}`

  console.log(url)
  const list = await axios.get(url)
  if (list.data.code != '0') {
    throw new Error("quer trans error:" + list.msg)
  }
  if(addr==tradeMingingOKaddress) {
  }
  return {hits:list.data.data.list, total:list.data.data.total} 
}


const TOKEN_PRICE = {}
const TOKEN_DECIMAL = {}

const tokenPrice = async(address) => {
  if(TOKEN_PRICE[address]) {
    return TOKEN_PRICE[address]
  }
  const tokenContract = new provider.eth.Contract(erc20Abi, address)
  const decimal = await tokenContract.methods.decimals().call()
  TOKEN_DECIMAL[address] = decimal
  let price = 0
  if (address.toLowerCase()  == usdtAddress.toLowerCase()) {
    price = 1;
  } else {
    try {
      price = await orcalContract.methods.consult(address, String(Math.pow(10, decimal)), usdtAddress).call()
      price = price/Math.pow(10, USDT_DECIMAL)
    } catch (error) {
      console.log(address, 'get price', error)
    }
  }
  TOKEN_PRICE[address] = price
  return price;
}

const accumulateHrs = (liqAccus, transAmount, transTime, lastTimeStamp) => {
  transTime = transTime + TIME_ZONG_OFFSET*3600
  if(new Date().getTime() - transTime*1000 < 3600*1000*24) {
    const transHr = new Date(transTime*1000 ).getHours()
    const hrKey = 'h'+transHr
    if (liqAccus[hrKey].lt - transTime*1000  > 3600*1000  || liqAccus[hrKey].lt - transTime*1000  < -3600*1000 ){
      liqAccus[hrKey].lt = transTime
      liqAccus[hrKey].value=0
    }

    liqAccus[hrKey].value +=transAmount
    if(liqAccus[hrKey].lt < transTime) {
      liqAccus[hrKey].lt = transTime
    }
  }
}

const swapTransHandler = async(trans, config) => {
  
  const methodId = '0x' + getTransAgs(trans.Input, 0)
  let transAmount = 0
  // addLiquidityETH -- 0xf305d719,
  //addLiquidity -- 0xe8e33700, 0x3351733f
  //removeLiquidity -- 0xbaa2abde
  // removeLiquidityETH --ox02751cec
  // removeLiquidityWithPermit -- 0x2195995c
  //-swapExactTokensForTokens -- 0x38ed1739
  //-swapTokensForExactTokens -- 0x8803dbee
  //-swapExactETHForTokens -- 0x7ff36ab5
  //-swapTokensForExactETH-- 0x4a25d94a
  //-swapExactTokensForETH --0x18cbafe5
  //-swapETHForExactTokens-- 0xfb3bdb41
  //-swapExactTokensForTokensSupportingFeeOnTransferTokens --0x5c11d795
  //-swapExactETHForTokensSupportingFeeOnTransferTokens -- 0xb6f9de95
  //-swapExactTokensForETHSupportingFeeOnTransferTokens -- 0x791ac947
  if(methodId == '0xf305d719' || methodId == '0x02751cec' || methodId == '0xded9382a') { //addLiquidityETH, removeLiquidityETH，removeLiquidityETHWithPermit
    const ethCount = hex2int(getTransAgs(trans.Input, 4))/Math.pow(10, 18)
    transAmount = await tokenPrice(wethAddress)*ethCount*2
    config.liqTotalAmount += transAmount
    accumulateHrs(config.liqAccus, transAmount, trans.Timestamp, config.lastTimeStamp*1000)
  } else if (methodId == '0xe8e33700' || methodId == '0xbaa2abde' || methodId == '0x2195995c') { //addLiquidity, removeLiquidity, removeLiquidityWithPermit
    const tokenAaddr = parseAddr(getTransAgs(trans.Input, 1))
    const tokenAPrice =await tokenPrice(tokenAaddr)
    if(tokenAPrice > 0) {
      transAmount = tokenAPrice*hex2int(getTransAgs(trans.Input, 3))*2/Math.pow(10, TOKEN_DECIMAL[tokenAaddr])
    } else {
      const tokenBaddr = parseAddr(getTransAgs(trans.Input, 2))
      const tokenBPrice =await tokenPrice(tokenBaddr)
      if (tokenBPrice > 0) {
        transAmount = tokenBPrice*hex2int(getTransAgs(trans.Input, 4))*2/Math.pow(10, TOKEN_DECIMAL[tokenBaddr])
      }
    }
    config.liqTotalAmount += transAmount
    accumulateHrs(config.liqAccus, transAmount, trans.Timestamp, config.lastTimeStamp*1000)
  } else if (methodId == '0x38ed1739' || methodId=='0x5c11d795') { //swapExactTokensForTokens， swapExactTokensForTokensSupportingFeeOnTransferTokens
    const tokenAaddr = parseAddr(getTransAgs(trans.Input, 7))
    const tokenAPrice =await tokenPrice(tokenAaddr)
    if(tokenAPrice > 0) {
      transAmount =tokenAPrice*hex2int(getTransAgs(trans.Input, 1))*2/Math.pow(10, TOKEN_DECIMAL[tokenAaddr])
    } else {
      const tokenBaddr = parseAddr(trans.Input.substr(trans.Input.length-64, 64))
      const tokenBPrice =await tokenPrice(tokenBaddr)
      if (tokenBPrice > 0) {
        transAmount = tokenBPrice*hex2int(getTransAgs(trans.Input, 2))*2/Math.pow(10, TOKEN_DECIMAL[tokenBaddr])
      }
    }
    config.swapTotalAmount += transAmount
    config.swapTransCount ++
    accumulateHrs(config.swapAccus, transAmount, trans.Timestamp, config.lastTimeStamp*1000)
  } else if (methodId == '0x8803dbee') { //swapTokensForExactTokens
    const tokenAaddr = parseAddr(getTransAgs(trans.Input, 7))
    const tokenAPrice =await tokenPrice(tokenAaddr)
    if(tokenAPrice > 0) {
      transAmount =tokenAPrice*hex2int(getTransAgs(trans.Input, 2))*2/Math.pow(10, TOKEN_DECIMAL[tokenAaddr])
    } else {
      const tokenBaddr = parseAddr(trans.Input.substr(trans.Input.length-64, 64))
      const tokenBPrice =await tokenPrice(tokenBaddr)
      if (tokenBPrice > 0) {
        transAmount = tokenBPrice*hex2int(getTransAgs(trans.Input, 1))*2/Math.pow(10, TOKEN_DECIMAL[tokenBaddr])
      }
    }
    config.swapTotalAmount += transAmount
    config.swapTransCount ++
    accumulateHrs(config.swapAccus, transAmount, trans.Timestamp, config.lastTimeStamp*1000)
  } else if (methodId == '0x4a25d94a') { // swapTokensForExactETH
    transAmount =await tokenPrice(wethAddress)*hex2int(getTransAgs(trans.Input, 1))*2/Math.pow(10, 18)
    config.swapTotalAmount += transAmount
    config.swapTransCount ++
    accumulateHrs(config.swapAccus, transAmount, trans.Timestamp, config.lastTimeStamp*1000)
  } else if (methodId == '0x18cbafe5' || methodId =='0x791ac947') { //swapExactTokensForETH,swapExactTokensForETHSupportingFeeOnTransferTokens
    transAmount =await tokenPrice(wethAddress)*hex2int(getTransAgs(trans.Input, 2))*2/Math.pow(10, 18)
    config.swapTotalAmount += transAmount
    accumulateHrs(config.swapAccus, transAmount, trans.Timestamp, config.lastTimeStamp*1000)
  } else if (methodId == '0xfb3bdb41' || methodId=='0x7ff36ab5' || methodId=='0xb6f9de95') { //swapETHForExactTokens,swapExactETHForTokens,swapExactETHForTokensSupportingFeeOnTransferTokens
    const tokenAPrice =await tokenPrice(wethAddress)
    transAmount = tokenAPrice*trans.value*2
    config.swapTotalAmount += transAmount
    config.swapTransCount ++
    accumulateHrs(config.swapAccus, transAmount, trans.Timestamp, config.lastTimeStamp*1000)
  } else if (methodId=='0x4f887183' || methodId=='0x60c06040') { //setSwapMining
  } else {
    console.warn(`unknow methodId : ${methodId} transhash ${trans.hash}`)
  }
  return config
}


const parseTransRsp = async(queryRsp, config, transHandler) => {
  let maxHeight = 0
  for(const trans of queryRsp.hits) {
    if(trans.id > config.lastBlockNo && (trans.Status == '1' ||trans.symbol=='XT')) { 
      config = await transHandler(trans, config)
    }
  } 
  return config
}

const queryTrans = async(addr, config, transHandler) => {
  const limit = 100
  let page = config.lastPage
  if (page == 0) {
    page = 1
  }
  // const start = config.lastTimeStamp + 1
  // const end = parseInt(new Date().getTime()/1000) - 1
  let queryRsp = await doQueryTrans(addr, null, null, limit, page)
  config = await parseTransRsp(queryRsp, config, transHandler)
  while(queryRsp.total > limit*page) {
    page ++;
    queryRsp = await doQueryTrans(addr, null, null, limit, page)
    config = await parseTransRsp(queryRsp, config, transHandler)
  }
  config.lastPage =page
  config.lastBlockNo = queryRsp.hits[queryRsp.hits.length-1].id
  return config
}

function sum(arr) {
  var sum = 0;
  for (var key in arr) {
      sum += arr[key].value
  }
  return sum
}

const fetchSwapTrans =  async() => {
  let config = db.get('swap').value()
  config= await queryTrans(routerOKAddress, config, swapTransHandler)
  db.set('swap', config).write()
  let swaptrans = {}
  swaptrans.totalAmount = config.swapTotalAmount
  swaptrans.totalCount = config.swapTransCount
  swaptrans.lstDayAmount = sum(config.swapAccus)
  transdb.set('swap', swaptrans).write()

  let liqTrans = {}
  liqTrans.totalAmount = config.liqTotalAmount
  liqTrans.lstDayAmount = sum(config.liqAccus)
  transdb.set('liquidity', liqTrans).write()
  transdb.set('lastTimeStamp', config.lastTimeStamp).write()
}


fetchSwapTrans()

let pools = {}

const filterPool = (pools, pid) => {
  for(const pool of pools) {
    if(pool.pid==pid) {
      return pool
    }
  }
  return 'undefined'
}

const farmTransHandler = async(trans, config) => {
  const methodId = '0x' +  getTransAgs(trans.Input, 0)
  if(methodId =='0xe2bbb158' || methodId=='0x441a3e70') {// deposit, withdraw
    const pid = hex2int(getTransAgs(trans.Input, 1))
    const amount = hex2int(getTransAgs(trans.Input, 2))
    let transAmount = 0
    let pool = filterPool(pools.lps, pid)
    if(pool != 'undefined') {
      transAmount = pool.lpPrice * amount/Math.pow(10, 18)
    } else {
      pool = filterPool(pools.single, pid)
      transAmount = pool.tokenPriceInUsdt * amount/Math.pow(10, pool.decimal)
    }
    config.farmTotalAmount += transAmount
    if(methodId =='0xe2bbb158') {
     config.depositTotalCount ++
    }
    accumulateHrs(config.farmAccus, transAmount, trans.Timestamp, config.lastTimeStamp*1000)
  }
  return config
}

const fetchFarmTrans =async() => {
  let config = db.get('farm').value()
  config= await queryTrans(farmOkAddress, config, farmTransHandler)
  db.set('farm', config).write()
  let farmtrans = {}
  farmtrans.totalAmount = config.farmTotalAmount
  farmtrans.depositCount = config.depositTotalCount
  farmtrans.lstDayAmount = sum(config.farmAccus)
  transdb.set('farm', farmtrans).write()
  transdb.set('lastTimeStamp', config.lastTimeStamp).write()
}

const tradeMingingTransHandler = async(trans, config) => {

  const xtPrice =await tokenPrice(XT_ADDRESS)
  const transAmount = trans.value*xtPrice
  config.tradeTotalAmount += transAmount
  accumulateHrs(config.tradeAccus, transAmount, trans.Timestamp, config.lastTimeStamp*1000)

  return config
}
const fetchTradeMingingTrans =async() => {
  let config = db.get('trade').value()
  config= await queryTrans(tradeMingingOKaddress, config, tradeMingingTransHandler)
  db.set('trade', config).write()
  let tradetrans = {}
  tradetrans.totalAmount = config.tradeTotalAmount
  tradetrans.lstDayAmount = sum(config.tradeAccus)
  transdb.set('tradeMing', tradetrans).write()
  transdb.set('lastTimeStamp', config.lastTimeStamp).write()
}

const fetchOthers = async () => {
  let lpsAmout = {"totalUsdtValue":0};
  if(pools.lps.length > 0) {
    lpsAmout = pools.lps.reduce((prev, current)=> {return {totalUsdtValue: prev.totalUsdtValue +current.totalUsdtValue}})
  }
  let singleAmout = {"totalUsdtValue":0};
  if(pools.single.length > 0) {
    singleAmout = pools.single.reduce((prev, current)=> {return {totalUsdtValue: prev.totalUsdtValue +current.totalUsdtValue}})
  }
  transdb.set('poolTvl', singleAmout.totalUsdtValue+lpsAmout.totalUsdtValue).write()
  
  const xtPrice =await tokenPrice(XT_ADDRESS)
  transdb.set('xtPrice', xtPrice).write()

  const xtContract = new provider.eth.Contract(xtTokenAbi, XT_ADDRESS)
  const totalSupply = await xtContract.methods.totalSupply().call()
  transdb.set('deflationRate', totalSupply/maxXTSupply*100).write()

  const swapOutput = await xtContract.methods.minterInfo(tradeMingingAddress).call()
  const farmOutput = await xtContract.methods.minterInfo(farmAddres).call()

  transdb.set('mingingOutput',(parseInt(swapOutput.mintSupply)+parseInt(farmOutput.mintSupply))/Math.pow(10, 18)).write()
}

axios.get(POOL_URL).then(resp => {
  pools = resp.data
  fetchFarmTrans()
  // fetchTradeMingingTrans()
  fetchOthers()
})



