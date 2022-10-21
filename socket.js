/*
 * @Author: error: git config user.name && git config user.email & please set dead value or install git
 * @Date: 2022-07-21 10:21:21
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2022-07-29 21:06:32
 * @FilePath: \express\socket.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEWeb 
 */
var app = require('./app');
var http = require('http');
let webSocket =http.Server(app)
const {formatDate,createTempId}=require('./util/util')
const users={}
const io = require("socket.io")(webSocket, {
  transports:["websocket"] //设置通话只允许websocket
});
/*
1.登录 online
2.进入聊天室 enterChat
3.离开聊天室 leaveChat
4.登出  disconnect

*/
io.on("connection",(socket)=>{
    console.log('成功建立连接',`用户id为${socket.id}`)
    //登录
    socket.on('online',({uid,nikname})=>{
      //如果已存在 则断开上次的链接
      if(users[uid]){
        users[uid].socket.disconnect();
      }
      users[uid]={
        uid,
        nikname,
        socket:socket
      }
      socket.uid=uid
      socket.ghost=false
    })
    //进入聊天室
    socket.on('enterChat',({uid=createTempId(),nikname})=>{
      //广播进入
      io.sockets.emit('logged',nikname)
      //如果游客已存在
     if(users[uid]){
      return 
     }
     users[uid]={
      uid,
      nikname,
      socket:socket
    }
    socket.uid=uid
    socket.ghost=true
    })
    //离开聊天室
   socket.on('leaveChat',()=>{
    let uid=socket.uid
    let nikname=users[uid]?.nikname
    //如果是游客
    if(socket.ghost){
     socket.disconnect()
     delete users[uid]
    }
    //广播离开
    io.sockets.emit('log out',nikname)
   })
   //断开聊天
    socket.on('disconnect',()=>{
      let uid=socket.uid
      delete users[uid]
    })
    //发送信息
    socket.on('send',(msg)=>{
      let nikname=users[socket['uid']]['nikname']
      //向除了自己的用户发送 socket.broadcast
      socket.broadcast.emit('chat',{
        nikname,
        msg:msg,
        time:formatDate()
      })
    })
  })

webSocket.listen(8000)
module.exports  = webSocket
