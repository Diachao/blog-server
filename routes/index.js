/*
 * @Author: your name
 * @Date: 2022-04-02 21:36:56
 * @LastEditTime: 2022-09-25 19:59:40
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \司文超-node-第二十六天\express\routes\awaterRouter.js
 */
var express = require('express');
const router = express.Router();
var createError = require('http-errors');



/* GET home page. */
router.get('/', (req, res, next) => {
  if (req.isPass) {
    res.send(200, {
      message: "自动登录成功"
    })
  }
  if (!req.isPass) {
    next(createError(422))
  }
});

module.exports = router;