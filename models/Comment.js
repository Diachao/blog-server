/*
 * @Author: your name
 * @Date: 2022-04-26 16:00:31
 * @LastEditTime: 2022-04-26 18:37:35
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \作业\express\models\Comment.js
 */
const mongoose = require('mongoose')
const {
  Schema
} = mongoose
const {
  formatDate
} = require('../util/util')
const schema = new Schema({
  //评论内容
  content: {
    type: String,
    required: true
  },
  //评论人
  uid: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User"
  },
  //评论的文章
  aid: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Article"
  },
  //评论时间
  date: {
    type: mongoose.SchemaTypes.Date,
    default: Date.now,
    get(val) {
      return formatDate(new Date(val), "yyyy年MM月dd日 hh:mm:ss")
    }
  }

})
schema.set('toJSON', {
  getters: true
});
//文章的评论数据库
module.exports = mongoose.model('Comment', schema)