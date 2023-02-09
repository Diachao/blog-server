/*
 * @Author: your name
 * @Date: 2022-04-04 09:56:22
 * @LastEditTime: 2022-04-04 11:02:11
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \作业\司文超-node-第二十七天\express\core\statuCode.js
 */
const userTtC = {
  'USER_ADD': "4010",
  'USER_TRIM': '4012',
  'USER_NOTEXIT': '4015',
  'USER_DR': "4016",
  'USER_NOF': "4014",
  'USER_FOND': "4013",
  'USER_ERRPWD': '4019',
  'USER_INN': '4020',
  'USER_LOGIN': "4021",
  'USER_FERR': "4099",
}
const userCtM = {
  '4010': '用户注册成功',
  '4012': '用户名或密码不能为空',
  '4016': '用户已存在',
  '4014': '用户不存在',
  '4013': '用户查询成功',
  '4019': '密码错误',
  '4020': '账号密码验证成功',
  '4021': '登录成功',
  '4099': '用户查询错误',
  '4015': '账号不存在，请先注册'
}

module.exports = {
  getUserStatusMsg (tag) {
    if (!tag) {
      return false
    }
    let statusCode = userTtC[tag]
    let errMsg = userCtM[statusCode]
    return {
      statusCode, errMsg, tag
    }
  }
}