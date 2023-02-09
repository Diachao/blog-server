/*
 * @Author: your name
 * @Date: 2022-04-12 15:43:37
 * @LastEditTime: 2022-05-23 22:07:16
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE/.
 * @FilePath: \作业\express\routes\index.js
 */
var express = require('express');
const router = express.Router();
const User = require('../models/User')
const Column = require('../models/Column')
const Article = require('../models/Article')
//无用
/* GET home page. */
router.get('/', async (req, res, next) => {
  let id = req._id
  try {
    let result = await User.findById(id)
    let articleCount = await Article.find().count()
    let ColumnCount = await Column.find().count()
    result = result.toJSON(result)
    result = Object.assign(result, {
      articleCount,
      ColumnCount
    })
    res.send(200, {
      message: '查询成功',
      data: result
    })
  } catch (err) {
    next(err)
  }
});
router.put('/', async (req, res, next) => {
  let id = req._id
  try {
    let putData = req.body
    await User.findByIdAndUpdate(id, putData)
    res.send(200, {
      message: '查询成功'
    })
  } catch (err) {
    next(err)
  }
});

module.exports = router;