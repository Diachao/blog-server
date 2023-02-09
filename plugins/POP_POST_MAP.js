/*
 * @Author: your name
 * @Date: 2022-05-01 23:31:13
 * @LastEditTime: 2022-05-03 15:27:17
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \Node第四十九天  个人博客 资源请求 资源提交联动 API\司文超-node-第四十八天\express\plugins\POP_CT_MAP.js
 */
const User = require('../models/User')
const Article = require('../models/Article')
const Column = require('../models/Column')
const Comment = require('../models/Comment')
module.exports = {
  "Article": {
    _refId: "column",
    _model: Column,
    act: "findByIdAndUpdate",
    options: function (_id) {
      return {
        "$push": {
          "aids": _id
        }
      }
    }
  },
  "Comment": {
    _refId: "aid",
    _model: Article,
    act: "findByIdAndUpdate",
    options: function (_id) {
      return {
        "$push": {
          "comment": _id
        },
        //当创建一条评论是就将此文章的评论数加一
        "$inc": {
          "comment_num": 1
        }
      }
    }
  }
}