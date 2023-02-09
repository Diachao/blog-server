/*
 * @Author: your name
 * @Date: 2022-04-24 15:02:54
 * @LastEditTime: 2022-04-30 22:13:32
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \作业\mongoose\middleware\midsource.js
 */
//拐点类库
const inflection = require('inflection')
const createError = require('http-errors')
module.exports = {
  resourceMiddleware: async (req, res, next) => {
    //inflection.classify方法 例如：将 users 转变为 User
    const modelName = inflection.classify(req.params.resource)
    //将集合模式挂载到req上
    try {
      req.Model = require(`../models/${modelName}`)
      next()
    } catch (err) {
      next(createError(404))
    }

  }
}