/*
 * @Author: your name
 * @Date: 2022-04-26 15:59:43
 * @LastEditTime: 2022-04-26 17:11:58
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \作业\express\models\Cloumn.js
 */
const mongoose = require('mongoose')

const {
  Schema
} = mongoose

const schema = new Schema({
  //分类名称内容
  name: {
    type: String,
    required: true
  },
  //分类文章的集合
  aids: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Article"
  }],
  //评论时间
  date: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now
  },
  uid:{
    type: mongoose.SchemaTypes.ObjectId,
  }

})
//文章的分类数据库
module.exports = mongoose.model('Column', schema)