const { decrypt, generateKeys } = require('../util/util');
const fs = require('fs').promises;
const fsSync = require('fs')
const { pubKeyPath, priKeyPath } = require('../config')
/*
 * @Author: your name
 * @Date: 2022-03-31 14:49:42
 * @LastEditTime: 2022-10-21 15:46:50
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \作业\express\core\rsa-user.js
 */
module.exports = {
  //pwd为加密后的密码
  async vertifyPwd (pwd) {
    return await decrypt(pwd)
  },
  getPuKeySync () {
    return fsSync.readFileSync(pubKeyPath, 'utf8')
  },
  //获取公钥
  async getPuKey () {
    let key
    try {
      key = await fs.readFile(pubKeyPath, 'utf8')
    } catch (err) {
      generateKeys()
      key = await fs.readFile(pubKeyPath, 'utf8')
    }
    return key
  },
  //获取私钥
  async getPrKey () {
    let key
    try {
      key = await fs.readFile(priKeyPath, 'utf8')
    } catch (err) {
      generateKeys()
      key = await fs.readFile(priKeyPath, 'utf8')
    }
    return key
  }
}
