/*
 * @Author: your name
 * @Date: 2022-03-31 15:24:32
 * @LastEditTime: 2022-04-30 21:26:50
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \作业\express\routes\getPukey.js
 */

const express = require('express')
const Key = require('../models/Key')
const router = express.Router();
router.get('/', async (req, res, next) => {
  //从数据库中拿公钥
  let key = await Key.findOne();
  res.send(200, {
    data: {
      message: "ok",
      data: {
        pubKey: key.content
      }
    }
  })

})
module.exports = router