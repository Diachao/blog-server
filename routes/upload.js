/*
 * @Author: your name
 * @Date: 2022-04-30 22:31:38
 * @LastEditTime: 2022-07-16 17:54:42
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \Node第四十八天  个人博客 分页 文件上传 接口\作业\司文超-node-第四十七天\express\routes\upload.js
 */
const express = require('express')
const router = express.Router();
const multer = require('multer')
const assert = require('http-assert')
const path = require("path")
const fs = require("fs")
const {
  uploadPath,
  uploadURL,
  maxFileSize
} = require('../config')
let storageFile = multer.diskStorage({
  destination(req, file, cb) {
    //动态获取路径
    let fileType = req.params['classify'].trim() ?? "other"
    fileType = path.join(uploadPath, fileType);
    //这里只能用同步创建文件夹 不能异步
    fs.existsSync(fileType) || fs.mkdirSync(fileType);
    cb(null, fileType)
  },
  filename(req, file, cb) {
    let {
      ext,
      name
    } = path.parse(file.originalname);
    cb(null, `${name}-${Date.now()}${ext}`)
  }
})
let upload = multer({
  storage: storageFile,
  limits: {
    //设置文件传输的大小
    fileSize: maxFileSize
  }
})
//single('参数')必须和form-data的键名一样
router.use('/:classify', upload.any(), function (req, res, next) {
  try {
    let fileType = req.params['classify'].trim() ?? ""
    assert(fileType, 400, '文件传输不正确')
    let uid=req._id
    if (fileType === 'user') {
      assert(uid, 422, '用户头像必须指定UID')
    }
    let fileURLS = req.files.map(item => {
      let {
        filename,
        destination
      } = item
      return path.join(uploadURL, path.parse(destination).name, filename).replace('\\', '//').replace(/\\/g, '/')
    })

    let resultData = {
      message: "上传成功",
      data: {
        fileURL: fileURLS[0]
      }
    }
    if (fileType === 'article') {
      let data = fileURLS
      resultData = {
        "errno": 0,
        data
      }
    }
    res.send(200, resultData)
  } catch (err) {
    next(err)
  }

})


module.exports = router