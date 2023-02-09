/*
 * @Author: your name
 * @Date: 2022-04-24 14:47:10
 * @LastEditTime: 2022-05-23 20:37:04
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \作业\mongoose\models\User.js
 */
// const mongoos = require('../plugins/db')
const mongoose = require('mongoose')
const {
  encrypt,
} = require('../util/util')
const {
  Schema
} = mongoose
const {
  uploadURL
} = require('../config')
const path = require('path')
/*
username:用户名
  type String
  required:true 必填
  unique: true

password:密码
  type String
  select false 不可查
  required:true 必填

email 邮箱
  type String
  unique true 唯一
    validate /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/ "请输入合法邮箱地址"

awater 头像
 type String(图片地址)
 default:默认地址

nikname 昵称
  type String
  validate /^\w{6,12}$/ 名字只能是数字汉字和_
  default 默认名称
*/

const schema = new Schema({
  username: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  password: {
    type: String,
    //查询时不返回这个字段
    select: false,
    required: true,
    set(val) {
      //往数据库添加是进行二次加密
      return encrypt(val)
    }
  },
  email: {
    type: String,
    unique: false,
    //对所填的邮箱进行校验
    validate: {
      validator(value) {
        return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(value)
      },
      //message用于返回错误信息
      message: "请输入合法邮箱地址"
    }
  },
  signature: {
    type: String,
    default: "请写一条自己的个签吧"
  },
  avatar: {
    type: String,
    default: 'http://127.0.0.1:3000/images/pic3.png'
  },
  nikname: {
    type: String,
    //对所填的昵称进行校验
    validate: {
      validator(value) {
        return /^[\w|\u4e00-\u9fa5]{2,12}$/g.test(value)
      },
      //message用于返回错误信息
      message: "昵称请输入2-12为的数字、汉字、_"
    },
    default: "填入用户昵称"
  },
  //用于关联文章的数据库
  article: {
    //id是文章的id 不是user的id
    type: mongoose.SchemaTypes.ObjectId,
    ref: "Article"
  },
})
//用户的数据库
module.exports = mongoose.model('User', schema)
// const User = mongoose.model('User', schema)
// User.create({
//   username: "小超122",
//   password: "124444444!",
//   nikname: '小超努力学前端',
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