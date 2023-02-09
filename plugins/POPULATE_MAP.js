/*
 * @Author: your name
 * @Date: 2022-05-01 22:40:09
 * @LastEditTime: 2022-05-03 14:34:43
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \Node第四十九天  个人博客 资源请求 资源提交联动 API\司文超-node-第四十八天\express\plugins\POPULATE_MAP.js
 */
module.exports = {
  "Article": [{
      "path": "author",
      "select": "nikname avatar"
    },
    {
      "path": "column",
      "select": "name"
    },
    {
      "path": "comment",
      "select": "content date uid",
      "populate": {
        "path": "uid",
        "select": "nikname avatar",
      }
    }
  ],
  "Comment": [{
    "path": "uid",
    "select": "nikname avatar"
  }],
  "Column": [{
    "path": "aids",
    "select": "title pic date hit_num comment_num like_num author"
  }]
}