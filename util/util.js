/*
 * @Author: your name
 * @Date: 2022-03-31 14:27:56
 * @LastEditTime: 2022-07-23 10:01:43
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \作业\express\util\util.js
 */
const NodeRSA = require('node-rsa');
const path = require('path')
const fs = require('fs')
const cerPath = path.join(process.cwd(), './auth')
const mongoPage = require("mongoose-sex-page")
const qs = require('qs')


//创建秘钥
function generateKeys() {
  //实例化 b 秘钥位 bit 越大越安全 256 , 512, 1024 - 4096
  const newkey = new NodeRSA({
    b: 512
  });

  //设置秘钥模式
  newkey.setOptions({
    encryptionScheme: 'pkcs1'
  })

  //设置公钥 
  let public_key = newkey.exportKey('pkcs8-public') //公钥,

  //设置私钥
  let private_key = newkey.exportKey('pkcs8-private') //私钥

  //写入公钥 私钥 cer文件
  fs.writeFileSync(path.join(cerPath, 'private.cer'), private_key);
  fs.writeFileSync(path.join(cerPath, 'public.cer'), public_key);

}

//加密
function encrypt(plain) {
  //读取秘钥 公钥
  let public_key = fs.readFileSync(path.join(cerPath, 'public.cer'), 'utf8');
  const nodersa = new NodeRSA(public_key);

  //设置秘钥 scheme
  nodersa.setOptions({
    encryptionScheme: 'pkcs1'
  });

  //调用加密方法  plain是需要加密的明文 加密生成的格式
  const encrypted = nodersa.encrypt(plain, 'base64');
  return encrypted;
}

//解密
function decrypt(cipher) {

  // 获取私钥
  let private_key = fs.readFileSync(path.join(cerPath, 'private.cer'), 'utf8');
  //私钥实例化 NodeRSA
  let prikey = new NodeRSA(private_key);

  //设置 模式 scheme pkcs1
  prikey.setOptions({
    encryptionScheme: 'pkcs1'
  });
  // decrypt(解密密文, 解密后格式)
  return prikey.decrypt(cipher, 'utf8')
}
/* 
model 数据集合
  query find寻找条件
  options, select必选
  size 设置每页多少数据
  page 指定当前页
  dis 指定客户端要显示的页码数量
*/
async function pagination({
  model,
  query,
  options,
  size,
  page,
  dis,
  populate
}) {
  /*
  size 设置每页多少数据
  page 指定当前页
  display 指定客户端要显示的页码数量
  */
  if (typeof query == 'string') {
    query = qs.parse(query)
  }
  let result = await mongoPage(model).find(query).sort({ '_id': -1 }).populate(populate).select(options).size(size).page(page).display(dis).exec()
  let {
    total,
    records,
    pages,
    display
  } = result
  let list = records
  let count = records.length;
  return {
    count,
    page,
    size,
    total,
    list,
    pages,
    display
  }
}

function toDouble(num) {
  return String(num)[1] && String(num) || '0' + num;
}

function formatDate(date = new Date(), format = "yyyy-MM-dd hh:mm:ss") {

  let regMap = {
    'y': date.getFullYear(),
    'M': toDouble(date.getMonth() + 1),
    'd': toDouble(date.getDate()),
    'h': toDouble(date.getHours()),
    'm': toDouble(date.getMinutes()),
    's': toDouble(date.getSeconds())
  }

  //逻辑(正则替换 对应位置替换对应值) 数据(日期验证字符 对应值) 分离
  return Object.entries(regMap).reduce((acc, [reg, value]) => {
    return acc.replace(new RegExp(`${reg}+`, 'g'), value);
  }, format);
}
 function createTempId(){
  return Date.now()+Math.random().toString(36).slice(-6)
 }
module.exports = {
  encrypt,
  decrypt,
  generateKeys,
  pagination,
  formatDate,
  createTempId
}