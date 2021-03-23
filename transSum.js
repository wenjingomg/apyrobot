const hecoAddress = 'https://exchaintest.okexcn.com'
// const hecoAddress = 'http://54.162.86.58:3100'

const TRANS_API =  'https://www.oklink.com/api/explorer/v1/okexchain_test/addresses'

//address
const oracleAddress = '0x2619a22B1e399c473cC9A3C02FcEC826679F8D00'
const usdtAddress = '0xe579156f9dEcc4134B5E3A30a24Ac46BB8B01281'
const chefAddress = '0x1D256cFE65cBd73dF6a9bE499a4b3486a31D807E'
const mdxAddress = '0xE5e399B4D0b721bD0B616E076e07E4416B78AA3E'
const wethAddress = '0x70c1c53E991F31981d592C2d865383AC0d212225'
const routerAddress = '0x92eA108F89a7c7bC1Fc9F3efC8c21Ac6020153Ae'
const routerOKAddress = 'okexchain1jt4ppruf5lrmc87f70hu3ss6ccpqz5awps4m3g'
const USDT_DECIMAL = 10
const TIME_ZONG_OFFSET = 8

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
const pairAbi = require('./abi/pair.json')

// contract
const provider = new web3(hecoAddress)
const orcalContract = new provider.eth.Contract(oracleAbi, oracleAddress)
const chefContract = new provider.eth.Contract(chefAbi, chefAddress)

const getTransAgs = (input, id) => {
  if(id == 0) {
    return input.substring(0, 10)
  } else {
    return input.substr(10+(id-1)*64, 64)
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
const doQueryTrans = async(addr, start, end,limit, offset) => {
  const timestamp = new Date().getTime()
  const list = await axios.get(`${TRANS_API}/${addr}/transactions/condition?t=${timestamp}&limit=${limit}&offset=${offset}&txType=contractCall&start=${start}&end=${end}`)
  if (list.data.code != '0') {
    throw new Error("quer trans error:" + list.msg)
  }
  return {hits:list.data.data.hits, total:list.data.data.total} 
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
  if (address == usdtAddress) {
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
  transTime = transTime + TIME_ZONG_OFFSET*3600*1000
  if(new Date().getTime() - transTime < 3600*1000*24) {
    const transHr = new Date(transTime).getHours()
    const hrKey = 'h'+transHr
    if (liqAccus[hrKey].lt - transTime > 3600*1000 || liqAccus[hrKey].lt - transTime < -3600*1000){
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
  
  const methodId = getTransAgs(trans.input, 0)
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
  if(methodId == '0xf305d719' || methodId == '0x02751cec') { //addLiquidityETH, removeLiquidityETH
    const ethCount = hex2int(getTransAgs(trans.input, 4))/Math.pow(10, 18)
    transAmount = await tokenPrice(wethAddress)*ethCount*2
    config.liqTotalAmount += transAmount
    accumulateHrs(config.liqAccus, transAmount, trans.blocktime, config.lastTimeStamp*1000)
  } else if (methodId == '0xe8e33700' || methodId == '0xbaa2abde' || methodId == '0x2195995c') { //addLiquidity, removeLiquidity, removeLiquidityWithPermit
    const tokenAaddr = parseAddr(getTransAgs(trans.input, 1))
    const tokenAPrice =await tokenPrice(tokenAaddr)
    if(tokenAPrice > 0) {
      transAmount = tokenAPrice*hex2int(getTransAgs(trans.input, 3))*2/Math.pow(10, TOKEN_DECIMAL[tokenAaddr])
    } else {
      const tokenBaddr = parseAddr(getTransAgs(trans.input, 2))
      const tokenBPrice =await tokenPrice(tokenBaddr)
      if (tokenBPrice > 0) {
        transAmount = tokenBPrice*hex2int(getTransAgs(trans.input, 4))*2/Math.pow(10, TOKEN_DECIMAL[tokenBaddr])
      }
    }
    config.liqTotalAmount += transAmount
    accumulateHrs(config.liqAccus, transAmount, trans.blocktime, config.lastTimeStamp*1000)
  } else if (methodId == '0x38ed1739' || methodId=='0x5c11d795') { //swapExactTokensForTokens， swapExactTokensForTokensSupportingFeeOnTransferTokens
    const tokenAaddr = parseAddr(getTransAgs(trans.input, 7))
    if(tokenAPrice > 0) {
      transAmount =await tokenPrice(tokenAaddr)*hex2int(getTransAgs(trans.input, 1))*2/Math.pow(10, TOKEN_DECIMAL[tokenAaddr])
    } else {
      const tokenBaddr = parseAddr(trans.input.substr(trans.input.length-64, 64))
      const tokenBPrice =await tokenPrice(tokenBaddr)
      if (tokenBPrice > 0) {
        transAmount = tokenBPrice*hex2int(getTransAgs(trans.input, 2))*2/Math.pow(10, TOKEN_DECIMAL[tokenBaddr])
      }
    }
    config.swapTotalAmount += transAmount
    config.swapTransCount ++
    accumulateHrs(config.swapAccus, transAmount, trans.blocktime, config.lastTimeStamp*1000)
  } else if (methodId == '0x8803dbee') { //swapTokensForExactTokens
    const tokenAaddr = parseAddr(getTransAgs(trans.input, 7))
    if(tokenAPrice > 0) {
      transAmount =await tokenPrice(tokenAaddr)*hex2int(getTransAgs(trans.input, 2))*2/Math.pow(10, TOKEN_DECIMAL[tokenAaddr])
    } else {
      const tokenBaddr = parseAddr(trans.input.substr(trans.input.length-64, 64))
      const tokenBPrice =await tokenPrice(tokenBaddr)
      if (tokenBPrice > 0) {
        transAmount = tokenBPrice*hex2int(getTransAgs(trans.input, 1))*2/Math.pow(10, TOKEN_DECIMAL[tokenBaddr])
      }
    }
    config.swapTotalAmount += transAmount
    config.swapTransCount ++
    accumulateHrs(config.swapAccus, transAmount, trans.blocktime, config.lastTimeStamp*1000)
  } else if (methodId == '0x4a25d94a') { // swapTokensForExactETH
    transAmount =await tokenPrice(wethAddress)*hex2int(getTransAgs(trans.input, 1))*2/Math.pow(10, 18)
    config.swapTotalAmount += transAmount
    config.swapTransCount ++
    accumulateHrs(config.swapAccus, transAmount, trans.blocktime, config.lastTimeStamp*1000)
  } else if (methodId == '0x18cbafe5' || methodId =='0x791ac947') { //swapExactTokensForETH,swapExactTokensForETHSupportingFeeOnTransferTokens
    transAmount =await tokenPrice(wethAddress)*hex2int(getTransAgs(trans.input, 2))*2/Math.pow(10, 18)
    config.swapTotalAmount += transAmount
    accumulateHrs(config.swapAccus, transAmount, trans.blocktime, config.lastTimeStamp*1000)
  } else if (methodId == '0xfb3bdb41' || methodId=='0x7ff36ab5' || methodId=='0xb6f9de95') { //swapETHForExactTokens,swapExactETHForTokens,swapExactETHForTokensSupportingFeeOnTransferTokens
    const tokenAPrice =await tokenPrice(wethAddress)
    transAmount = tokenAPrice*trans.value*2
    config.swapTotalAmount += transAmount
    config.swapTransCount ++
    accumulateHrs(config.swapAccus, transAmount, trans.blocktime, config.lastTimeStamp*1000)
  } else if (methodId=='0x4f887183' || methodId=='0x60c06040') { //setSwapMining
  } else {
    console.warn(`unknow methodId : ${methodId} transhash ${trans.hash}`)
  }
  return config;
}

const parseTransRsp = async(queryRsp, config, transHandler) => {
  let maxHeight = 0
  for(const trans of queryRsp.hits) {
    if(trans.blocktime > config.lastTimeStamp*1000 && trans.status == 'SUCCESS') { 
      config = await transHandler(trans, config)
    }
  } 
  return config
}

const queryTrans = async(addr, config, transHandler) => {
  const limit = 50
  let offset = 0
  const start = config.lastTimeStamp + 1
  const end = parseInt(new Date().getTime()/1000) - 1
  let queryRsp = await doQueryTrans(addr, start, end, limit, offset)
  config = await parseTransRsp(queryRsp, config, transHandler)
  while(queryRsp.total > limit + offset) {
    queryRsp = await doQueryTrans(addr, start, end, limit, offset)
    config = await parseTransRsp(queryRsp, config, transHandler)
  }
  config.lastTimeStamp =end
  return config
}

const fetchSwapTrans =  async() => {
  let config = db.get('swap').value()
  config= await queryTrans(routerOKAddress, config, swapTransHandler)
  db.set('swap', config).write()
  let swaptrans = {}
  swaptrans.totalAmount = config.swapTotalAmount
  swaptrans.totalCount = config.swapTransCount
  swaptrans["24hrAmount"] = config.swapAccus.reduce((prev, next, index, array)=>prev.value + next.value)
  transdb.set('swap', swaptrans).write()

  let liqTrans = {}
  liqTrans.totalAmount = config.liqTotalAmount
  liqTrans["24hrAmount"] = config.liqAccus.reduce((prev, next, index, array)=>prev.value + next.value)
  transdb.set('liquidity', liqTrans).write()
}


fetchSwapTrans()

