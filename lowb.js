// const hecoAddress = 'https://exchaintest.okexcn.com'
const hecoAddress ='https://bsc-dataseed.binance.org'
const chefAddress = '0x843D4a358471547f51534e3e51fae91cb4Dc3F28'
const web3 = require('web3')
const provider = new web3(hecoAddress)
const chefAbi = require('./abi/lowb.json')

const chefContract = new provider.eth.Contract(chefAbi, chefAddress)

const fs = require('fs')
const path = require('path')

function writeLog(writeStream,logs) {
    // console.log('bool-write',writeStream.writable)
    writeStream.write(logs + '\n') //写入--关键代码
}
// 创建writeStream -- 写入流
function createWriteStream(fileName) {
    const fullFileName = path.join(__dirname,fileName) //读取文件名称，目录自行可修改
    const writeStream = fs.createWriteStream(fullFileName,{
        flags: 'a'
    })
    return writeStream //返回一个可写流
}
const accessWriteStream = createWriteStream('1.txt')
function access(log) {// 传入日志
    writeLog(accessWriteStream,log)
}

let i = 6718248
for (; i<=7317100; i=i+300) {
chefContract.getPastEvents('Transfer', {
    filter: {_from: '0x0000000000000000000000000000000000000000'},
    fromBlock: i,
    toBlock: i+299
}, (error, events) => { 
    if(events) {
        events.forEach(element => {
            if(element.returnValues.from==='0x0000000000000000000000000000000000000000' || element.returnValues.to ==='0x0000000000000000000000000000000000000000'){
                access(JSON.stringify(element))
            }
        });
  }})
}