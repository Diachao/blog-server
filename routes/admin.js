/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-05-22 10:20:23
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-05-23 20:27:18
 * @FilePath: \express\routes\admin.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require('express');
const router = express.Router();
const {
  sendToken
} = require('../core/sendToken')
const assert = require('http-assert')
const User = require('../models/User')
const createError = require('http-errors')
const {
  decrypt
} = require('../util/util')
/* GET users listing. */
router.post('/:classify', async function (req, res, next) {
  let {
    username,
    password
  } = req.body
  let user;
  let message;
  try {
    if (req.params.classify === 'user') {
      return false
    }
    //如果密码和账号不存在
    if (!username || username?.trim()?.length === 0 || !password || password?.trim()?.length === 0) {
      assert(false, 422, '账号密码必填')
    }
    //如果账号已存在或者格式不正确则会到err里
    if (req.params.classify === 'login') {
      user = await User.findOne({
        username
      }).select('+password')
      assert(user, 422, '用户不存在')
      assert.equal(decrypt(decrypt(user.password)), decrypt(password), 422, '密码错误')
      message = "登录成功"
    }
    if (req.params.classify === 'register') {
      user = await User.create(req.body)
      message = "注册成功"
    }



    let token = await sendToken(user);
    res.send(200, {
      message,
      data: {
        userId: user._id,
        token
      }
    })
  } catch (err) {
    next(err)
  }
});

module.exports = router;