// const hecoAddress = 'https://exchaintest.okexcn.com'
const hecoAddress ='https://http-mainnet.hoosmartchain.com'
const chefAddress = '0x7B9a9f3fAcB02590E9A44F4d3E21584689911bD7'
const mingingPoolAddress = "0xa944735DFDA74FE3dc94558B6559777e2438358A"
const web3 = require('web3')
const provider = new web3(hecoAddress)
const erc20Abi = require('./abi/erc20.json')
const chefAbi = require('./abi/masterchef.json')
const pairAbi = require('./abi/pair.json')
const mingingAbi = require('./abi/miningpool.json')

const chefContract = new provider.eth.Contract(chefAbi, chefAddress)


const gencoininfo = async () => {
    const poolLength = await chefContract.methods.poolLength().call()
    let coins = []
    let pid =0
    for(; pid < poolLength; pid ++) {
        console.log(pid)
        const {lpToken} = await chefContract.methods.poolInfo(pid).call()
        let isLp = false
        let symbol = ''
        let tokenAddresses = lpToken
        const lpTokenContr =  new provider.eth.Contract(erc20Abi, lpToken)
        symbol = await lpTokenContr.methods.symbol().call()
        if(symbol == 'XTLP') {
            isLp = true
            let pairContract = new provider.eth.Contract(pairAbi, lpToken)
            let token0 = await pairContract.methods.token0().call()
            let token0Contr =  new provider.eth.Contract(erc20Abi, token0)
            let tk0symbol = await token0Contr.methods.symbol().call()
            let token1 = await pairContract.methods.token1().call()
            let token1Contr =  new provider.eth.Contract(erc20Abi, token1)
            let tk1symbol = await token1Contr.methods.symbol().call()
            symbol = tk0symbol + "/" + tk1symbol
            if (tk0symbol == 'USDT' || tk0symbol == 'USDC' || tk0symbol == 'iUSDT') {
                tokenAddresses = token1
            } else {
                tokenAddresses = token0
            }
        } 
        coins.push({pid, lpAddresses:lpToken, tokenAddresses, symbol, isLp})
    }
    console.log(JSON.stringify(coins))

 // mining token list
  const miningPoolContract = new provider.eth.Contract(mingingAbi, mingingPoolAddress)
  const poolLength1 = await miningPoolContract.methods.poolLength().call()

  const tokenSymbols = {};

  for (i =0; i< poolLength1; i++) {
    // {token0, token1, xtamount,totalQuantity,quantity, allocPoint} 
    var poolInfo = await miningPoolContract.methods.poolInfo(i).call();
    let pairContract = new provider.eth.Contract(pairAbi, poolInfo.pair)
    let token0 = await pairContract.methods.token0().call()
    let token0Contr =  new provider.eth.Contract(erc20Abi, token0)
    let tk0symbol = await token0Contr.methods.symbol().call()
    let token1 = await pairContract.methods.token1().call()
    
    tokenSymbols[token0] = tk0symbol

    let token1Contr =  new provider.eth.Contract(erc20Abi, token1)
    let tk1symbol = await token1Contr.methods.symbol().call()
    tokenSymbols[token1] = tk1symbol
  }
  console.log(JSON.stringify(tokenSymbols))


}

gencoininfo()