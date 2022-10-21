/*
 * @Author: your name
 * @Date: 2022-04-04 09:47:24
 * @LastEditTime: 2022-07-14 09:44:05
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \作业\司文超-node-第二十七天\express\config.js
 */
const path = require("path")
module.exports = {
  host: '127.0.0.1',
  root: process.cwd(),
  port: 3000,
  keyPath: path.join(process.cwd(), '/auth'),
  pubKeyPath: path.join(process.cwd(), '/auth/public.cer'),
  priKeyPath: path.join(process.cwd(), '/auth/private.cer'),
  userPath: path.join(process.cwd(), '/user/user.json'),
  //上传文件的本地存储路径
  uploadPath: path.join(process.cwd(), '/upload'),
  //获取上传文件的网络地址的 协议+ip(或者域名)+端口
  uploadURL: 'http://127.0.0.1:3000/',
  //文件传输的最大字节数
  maxFileSize: 10240000
}