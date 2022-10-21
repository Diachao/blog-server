/*
 * @Author: your name
 * @Date: 2022-05-03 15:30:31
 * @LastEditTime: 2022-05-03 15:58:33
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \Node第五十天  个人博客  查询 权限 鉴权\司文超-node-第四十九天\express\routes\search.js
 */
const express = require('express')
const router = express.Router()
const Article = require("../models/Article")
const {
  pagination
} = require("../util/util")
router.get('/', async (req, res, next) => {
  let {
    q = ""
  } = req.query
  let regExp = new RegExp(q, "i")
  let option = {
    options: "title",
    model: Article,
    page: 1,
    size: 100,
    query: {
      $or: [{
          title: {
            $regex: regExp
          }
        },
        {
          body: {
            $regex: regExp
          }
        },
      ]
    },
    dis: 8
  }
  try {
    let result = await pagination(option)
    res.send(200, {
      message: '查询成功',
      data: result
    })
  } catch (err) {
    next(err)
  }

})
module.exports = router