// const hecoAddress = 'https://exchaintest.okexcn.com'
const hecoAddress ='https://http-testnet.hecochain.com'
const chefAddress = '0x102Bd46A5DeAb82840263897e1faa47052163Ce1'
const web3 = require('web3')
const provider = new web3(hecoAddress)
const erc20Abi = require('./abi/erc20.json')
const chefAbi = require('./abi/masterchef.json')
const pairAbi = require('./abi/pair.json')

const chefContract = new provider.eth.Contract(chefAbi, chefAddress)

//   {
    // pid: 0,
    // lpAddresses: '0x172a378B1aB64333bE2faa54C96476E5389F30AB', // 质押币地址 lpAddresses 统一用来查询余额，lp的话填写lp地址，单币的填币种地址
    // tokenAddresses: '0xE5e399B4D0b721bD0B616E076e07E4416B78AA3E', // tokenAddresses,单币的话不需要，lp填要获取价格的币种地址
    // symbol: 'XT/USDT',
    // islp: true
//   }

const gencoininfo = async () => {
    const poolLength = await chefContract.methods.poolLength().call()
    let coins = []
    let pid =0
    for(; pid < poolLength; pid ++) {
        console.log(pid)
        const {lpToken} = await chefContract.methods.poolInfo(pid).call()
        const isLp = pid < 14
        let symbol = ''
        let tokenAddresses = lpToken
        const lpTokenContr =  new provider.eth.Contract(erc20Abi, lpToken)
        symbol = await lpTokenContr.methods.symbol().call()
        if(symbol == 'OKXT') {
            const pairContract = new provider.eth.Contract(pairAbi, lpToken)
            const token0 = await pairContract.methods.token0().call()
            const token0Contr =  new provider.eth.Contract(erc20Abi, token0)
            const tk0symbol = await token0Contr.methods.symbol().call()
            const token1 = await pairContract.methods.token1().call()
            const token1Contr =  new provider.eth.Contract(erc20Abi, token1)
            const tk1symbol = await token1Contr.methods.symbol().call()
            symbol = tk0symbol + "/" + tk1symbol
            if (tk0symbol == 'USDT' || tk0symbol == 'USDC') {
                tokenAddresses = token1
            } else {
                tokenAddresses = token0
            }
        } 
        coins.push({pid, lpAddresses:lpToken, tokenAddresses, symbol, isLp})
    }
    console.log(JSON.stringify(coins))
}

gencoininfo()