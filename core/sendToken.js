/*
 * @Author: your name
 * @Date: 2022-04-16 14:19:29
 * @LastEditTime: 2022-04-16 14:20:56
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \司文超-node-第三十六天\express\core\sendToken.js
 */
const {
  getPrKey
} = require('./rsa-getKey')
const jwt = require('jsonwebtoken') //token生成包  JWT

module.exports = {
  async sendToken(result) {
    let {
      username,
      _id
    } = result
    let privateKey = await getPrKey()
    let token = jwt.sign({
      username,
      _id,
      exp: ~~((Date.now() / 1000) + 24 * 3600 * 3)
    }, privateKey, {
      algorithm: 'RS256'
    });
    return token
  }
}