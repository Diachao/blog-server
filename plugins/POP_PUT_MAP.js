/*
 * @Author: your name
 * @Date: 2022-05-03 09:36:52
 * @LastEditTime: 2022-05-03 15:51:33
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \Node第五十天  个人博客  查询 权限 鉴权\司文超-node-第四十九天\express\plugins\POP_PUT_MAP.js
 */
module.exports = {
  "Article": {
    "revisable": ["title", "body", "pic"],
    "field": "author"
  },
  "User": {
    "revisable": ["password", "email", "nikname","avater"],
    "field": "_id"
  },
  "Comment": {
    "revisable": ["content"],
    "field": "uid"
  },
  "Column": {
    "revisable": ["name"],
    //TODO 需要判断是否为写文章的作者来修改
    "field": "author"
  },
}