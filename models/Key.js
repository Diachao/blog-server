/*
 * @Author: your name
 * @Date: 2022-04-30 21:05:35
 * @LastEditTime: 2022-04-30 21:06:37
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \Node第四十八天  个人博客 分页 文件上传 接口\作业\司文超-node-第四十七天\express\models\Key.js
 */
const mongoose = require('mongoose')
const {
  Schema
} = mongoose

const schema = new Schema({
  //公钥内容
  content: {
    type: String,
    required: true
  },
  //时间
  date: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now
  }

})
//文章的分类数据库
module.exports = mongoose.model('Key', schema)