/*
 * @Author: your name
 * @Date: 2022-05-03 15:09:53
 * @LastEditTime: 2022-07-18 00:06:56
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \Node第五十天  个人博客  查询 权限 鉴权\司文超-node-第四十九天\express\routes\artLikes.js
 */
const express = require('express')
const router = express.Router()
const Article = require("../models/Article")
const jwt =require('jsonwebtoken')
const {getPuKeySync}=require("../core/rsa-getKey")
router.post('/:id', async (req, res, next) => {
  let token =req.headers?.authorization?.replace('Bearer ',"")
  let key = getPuKeySync()
  console.log(token)
  if(token){
    jwt.verify(token,key,function(err,data){
      if(err){
        console.log(err)
        return 
      }
      let userId=data._id
      if(userId){
        req._id=userId
      }
    })
  }
  next()},async (req,res,next)=>{
    let id = req.params.id
    let isLike=true
  try {
    console.log(req._id)
    let article =await Article.findById(id)
    console.log(article?.['likes_users'])
    isLike=!(article?.['likes_users'].includes(req._id))
    console.log(isLike)
    let num =isLike? 1 : -1
    let query ={
    $inc: {
      like_num: num
    }
  }
  if(req._id){
    query[isLike?"$addToSet":"$pull"]={
      likes_users:req._id
    }
  }
    let result = await Article.findByIdAndUpdate(id, query)
    let likes = ++result.like_num
    res.send(200, {
      message: "点赞成功",
      data: likes
    })
  } catch (err) {
    next(err)
  }

})
module.exports = router