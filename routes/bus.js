/*
 * @Author: your name
 * @Date: 2022-04-26 15:55:20
 * @LastEditTime: 2022-09-24 10:04:25
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \Node第四十六天  个人博客 mongoose 联合查询 集合schema配置\作业\express\routes\bus.js
 */

const express = require('express')
const router = new express.Router()
const createError = require('http-errors');
//这里必须引入相应的模块才能populate找到
const User = require('../models/User')
const Article = require('../models/Article')
const Column = require('../models/Column')
const Comment = require('../models/Comment')
const qs = require('qs')
const {
  pagination
} = require("../util/util");
const assert = require('http-assert');

const POPULATE_MAP = require("../plugins/POPULATE_MAP")
const POP_POST_MAP = require("../plugins/POP_POST_MAP")
const POP_GET_MAP = require("../plugins/POP_GET_MAP")
const POP_PUT_MAP = require("../plugins/POP_PUT_MAP")
const RESOURCE_POST_MAP = require('../plugins/RESOURCE_POST_MAP')
//创建资源
router.post('/', async (req, res, next) => {
  try {
    let modelName = req.Model.modelName;
    let body = req.body
    if (modelName in RESOURCE_POST_MAP) {
      body = RESOURCE_POST_MAP[modelName]['body'](body, req._id)
    }

    /*
    用于将文章的id添加到column对应的分类的aids上
    用于将comment的id添加到文章的comment上
    */
    const model = await req.Model.create(body)
    if (modelName in POP_POST_MAP) {
      /*
       _refId 是关联集合的id名
        _model,是关联集合
        act,是关联集合的操作findByIdAndUpload
        options(_id) 是关联集合的操作$push
      */
      let {
        _refId,
        _model,
        act,
        options
      } = POP_POST_MAP[modelName]
      let refId = req.body?. [_refId];
      let _id = model._id
      assert(refId, 422, `${_refId}必填`)
      await _model[act](refId, options(_id))
    }
    res.send(200, {
      message: "提交成功",
      data: {
        id: model._id
      }
    })
  } catch (err) {
    console.log(err)
    next(err)
  }

});
router.get('/', async (req, res, next) => {
  try {
    let {
      options = {}, page = 1, size = 25, query = {}, dis = 4, populate = {}, q = ""
    } = req.query; //这里是query 因为是get请求拼接到地址上
    query = qs.parse(query)
    let modelName = req.Model.modelName;
    if (modelName in POPULATE_MAP) {
      populate = POPULATE_MAP[modelName]
    }
    
    if(query.q){
      let regExp = new RegExp(query.q, "i")
      query = {
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
      }
    }
    let result = await pagination({
      model: req.Model,
      query,
      options,
      size,
      dis,
      page,
      populate
    })
    res.send(200, {
      message: '查询成功',
      data: result
    })
  } catch (err) {
    console.log(err)
    next(createError(422, '请求错误'))
  }
});
router.get('/:id', async (req, res, next) => {
  //获得当前模块的名称
  let modelName = req.Model.modelName
  let _id = req.params.id
  try {
    //找到对应id的集合 注！ 这里的item不是集合 如果加上await则返回对应的集合，但后面的exec()则不再视为函数
    let result = req.Model.findById(_id)
    assert(result, 422, "查询失败")
    //获取文章时使其的点击量增加1
    if (modelName in POP_GET_MAP) {
      let {
        act,
        options
      } = POP_GET_MAP[modelName]
      await req.Model[act](_id, options())
    }
    //获取这个模块的ref关联模块
    if (modelName in POPULATE_MAP) {
      let options = POPULATE_MAP[modelName]
      if (options[0]['path']) {
        //将模块的相应位置添加关联模块的相应内容
        result = result.populate(options)
      }
      result = await result.exec()
      res.send(200, {
        message: "查询成功",
        data: result
      })
    }
  } catch (err) {
    next(err)
  }

});
//更新资源
router.put('/:id', async (req, res, next) => {
  let putData = req.body //修改的内容
  let modelName = req.Model.modelName //集合的名称
  let id = req.params.id //资源的id
  let isPass = req.isPass //鉴权结果
  let userId = req._id //更改人的id
  try {
    //根据modelname来获取可以修改的属性
    let {
      revisable,
      field
    } = POP_PUT_MAP[modelName]
    //判断是否通过鉴权
    let isValidate = (modelName in POP_PUT_MAP) && isPass
    assert(isValidate, 403, '无权修改')
    let data = await req.Model.findById(id)
    assert(data, 404, '资源不存在')
    assert.equal(data?.[field], userId, 403, '无权修改')
    let updateData = Object.entries(putData).filter(([key, value]) => {
      return revisable.includes(key)
    })
    isValidate = updateData.length

    assert(isValidate, 400, '修改失败')
    updateData = Object.fromEntries(updateData)
    updateData["date"] = new Date().toISOString()
    await req.Model.findByIdAndUpdate(id, updateData)
    res.send(200, {
      message: '修改成功'
    })
  } catch (err) {
    next(err)
  }
});
//删除资源
router.delete('/:id', async (req, res) => {
  const item = await req.Model.deleteOne({
    _id: req.params.id
  })
  res.send({
    errMsg: 'ok'
  })
});
module.exports = {
  busRoute: router
}
/*
1.先设置一个文章分类和用户 文章
  分类  626e9a16b40e770cf1ccdaaa
  用户  627e0a17b1b85b129987e24f
  文章  627e0a751e869b13587d6396

  eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IuWwj-i2hTAwMCIsIl9pZCI6IjYyN2UwYTE3YjFiODViMTI5OTg3ZTI0ZiIsImV4cCI6MTY1MjY4NjQ4NywiaWF0IjoxNjUyNDI3Mjg3fQ.Yve57SUDCHsXmMuUeB-d7NmuyW2ahiYqVQH4ND-5n-15UvUOGh6y4elI7PwTnq5DpAUXGlyEvL-Zh-qTGze5xg
2.关联各个模块

3.搜索内容 $or
  使评论数量增加
4.当搜寻具体文章时 将点击量增加

错误
    400: 请求参数错误 请求路径错误
    401: jwt验证未通过 账号面错误
    403: 无权访问 权限不够
    404: 访问资源不存在 resource img file
    422: 用户不存在 密码错误 token过期
*/