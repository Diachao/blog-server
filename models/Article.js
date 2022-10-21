/*
 * @Author: your name
 * @Date: 2022-04-24 14:47:50
 * @LastEditTime: 2022-05-03 15:44:35
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \作业\mongoose\models\Article.js
 */
const mongoos = require('../plugins/db')
const mongoose = require('mongoose')
const {
  formatDate
} = require('../util/util')
const {
  Schema
} = mongoose
const {
  uploadURL
} = require('../config')
const schema = new Schema({
  //文章标题
  title: {
    type: String,
    required: true,
    default: "默认标题" + Date.now
  },
  //作者
  author: {
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "User"
  },
  //文章内容
  body: {
    type: String,
    required: true,
    set(val) {
      try {
        //将Unicode转码为汉字
        val = decodeURIComponent(`${val}`).replace(/\"/g, "\'")
        return val
      } catch (err) {
        return val
      }
    }
  },
  //图片
  pic: {
    type: String,
    default: `${uploadURL}images/pic1.jpg`
  },
  //文章日期
  date: {
    type: mongoose.SchemaTypes.Date,
    //创建文章是=时默认执行default
    default: Date.now,
    get(val) {
      return formatDate(new Date(val), "yyyy年MM月dd日 hh:mm:ss")
    }
  },
  //点击数量
  hit_num: {
    type: Number,
    default: 0
  },
  //评论数量
  comment_num: {
    type: Number,
    default: 0
  },
  //喜欢 点赞
  like_num: {
    type: Number,
    default: 0
  },
  //评论集合
  comment: [{
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Comment"
  }],
  //分类
  column: {
    //这里的id是column的id
    type: mongoose.SchemaTypes.ObjectId,
    required: true,
    ref: "Column",
  },
  likes_users:[{
    type:mongoose.SchemaTypes.ObjectId
  }]
})
schema.set('toJSON', {
  getters: true
});
//文章的数据库
module.exports = mongoose.model('Article', schema)



























// const Article = mongoose.model('Article', schema)
// Article.create({
//   title: "小超122",
//   body: "124444444!"
// }).then(doc => {
//   console.log(doc)
// }).catch(err => {
//   console.log(err)
//   //unique 唯一项目出错判断
//   if (err.message.indexOf('duplicate key error') !== -1) {
//     console.log('唯一项重复', err.keyPattern)
//     return
//   }
//   Object.entries(err.errors).map(([key, val]) => {
//     console.log(`error: ${key}, ${val.message} `)
//   })
// })