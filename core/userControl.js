const {
  userPath
} = require('../config')
const fs = require('fs').promises
const {
  getUserStatusMsg
} = require('./statuCode')
const {
  encrypt,
  decrypt
} = require('../util/util')
/*
 * @Author: your name
 * @Date: 2022-04-04 09:58:12
 * @LastEditTime: 2022-04-16 14:31:15
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \作业\司文超-node-第二十七天\express\core\userControl.js
 */
module.exports = {
  async addUser(username, pwd) {
    //对密码进行二次加密
    pwd = encrypt(pwd)
    let msg = await this.getUserInfo(username);
    //如果用户不存在则添加用户
    if (msg["tag"] === "USER_NOF") {
      let userID = await getNum()
      userID = ("000000" + userID).substr(-6);
      try {
        await appendUser({
          user_name: username,
          user_id: userID,
          user_pwd: pwd
        })
        let resData = getUserStatusMsg('USER_ADD')
        resData.statusCode = 200
        return {
          ...resData,
          data: {
            user_name: username,
            user_id: userID
          }
        }
      } catch (err) {
        console.log(err)
      }

    }
    //如果用户存在 则返回用户已存在
    if (msg["tag"] === "USER_FOND") {
      return {
        ...getUserStatusMsg("USER_DR")
      }
    }
    //如果getUserInfo返回信息为USER_FERR
    return {
      stauCode: msg.stauCode,
      msg: '注册失败'
    }
  },
  //验证身份信息
  async getUserInfo(username) {
    try {
      let user = await getUser();
      //find方法寻找相匹配的元素并返回
      let result = user.find(item => item['user_name'].trim() === username.trim())
      //如果数据库中没有这位用户，返回用户不存在
      if (!result) {
        return {
          ...getUserStatusMsg("USER_NOF")
        }
      }
      //用户存在
      return {
        ...getUserStatusMsg("USER_FOND"),
        data: {
          ...result
        }
      }
    } catch (err) {
      console.error(err)
      return {
        ...getUserStatusMsg('USER_FERR')
      }
    }
  },
  //验证账号密码
  async verifyUser(username, pwd) {
    try {
      let msg = await this.getUserInfo(username);
      //如果账号密码不存在
      if (msg['tag'] === "USER_NOF") {
        return {
          ...getUserStatusMsg("USER_NOTEXIT")
        }
      }
      let {
        user_name,
        user_id,
        user_pwd
      } = msg.data
      let verifyPWD = (decrypt(decrypt(user_pwd.trim())) === decrypt(pwd.trim()))
      //如果密码验证成功
      if (verifyPWD) {
        return {
          ...getUserStatusMsg("USER_INN"),
          data: {
            user_name,
            user_id
          }
        }
      }
      return {
        ...getUserStatusMsg("USER_ERRPWD")
      }
    } catch (err) {
      return {
        ...getUserStatusMsg("USER_ERRPWD")
      }
    }
  },
  //验证token是否正确
  async verifyToken(username, userID) {
    try {
      let user = await getUser();
      let verifyPWD = user.find(item => item['user_id'].trim() === userID.trim())
      //如果如果id验证不成功 返回用户不存在
      if (!verifyPWD) {
        return {
          ...getUserStatusMsg("USER_NOF"),
        }
      }
      //如果username正确，则查询成功
      if (verifyPWD['user_name'] === username) {
        return {
          ...getUserStatusMsg('USER_FOND'),
        }
      }
    } catch (err) {
      console.error(err)
      return {
        ...getUserStatusMsg('USER_FERR')
      }
    }
  }
}
async function getUser() {
  let user = await fs.readFile(userPath, 'utf8')
  return JSON.parse(user)
}
async function appendUser({
  user_name = "",
  user_id = "",
  user_pwd = ""
}) {
  let user = await getUser()
  user.push({
    user_name,
    user_id,
    user_pwd
  })
  try {
    fs.writeFile(userPath, JSON.stringify(user), 'utf8')
  } catch (err) {
    console.error(err)
    return false
  }
}
async function getNum() {
  let userList = await getUser()
  return userList.length;
}