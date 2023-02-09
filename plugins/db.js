/*
 * @Author: your name
 * @Date: 2022-04-24 14:48:04
 * @LastEditTime: 2022-05-23 20:27:09
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \作业\mongoose\plugins\db.js
 */
const mongoose = require('mongoose')
//链接数据库
mongoose.connect('mongodb://127.0.0.1:27017/blog', {
  useUnifiedTopology: true,
  useNewUrlParser: true
})
//获取链接的控制
const bd = mongoose.connection;
//报错提醒
bd.on('error', err => {
  console.log(err)
})
//连接成功时提醒
bd.on('open', () => {
  console.log('mongodb://127.0.0.1:27017/blog is open')
})
module.exports = {
  mongoose
}