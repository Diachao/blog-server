/*
 * @Author: your name
 * @Date: 2022-05-03 09:36:37
 * @LastEditTime: 2022-05-03 14:55:36
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \Node第五十天  个人博客  查询 权限 鉴权\司文超-node-第四十九天\express\plugins\POP_GET_MAP.js
 */
module.exports = {
  "Article": {
    "act": "findByIdAndUpdate",
    "options": function () {
      return {
        "$inc": {
          "hit_num": 1
        }
      }
    }
  }
}