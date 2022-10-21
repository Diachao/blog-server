/*
 * @Author: your name
 * @Date: 2022-03-31 14:26:19
 * @LastEditTime: 2022-09-25 19:12:50
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \作业\express\app.js
 */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const expressJWT = require("express-jwt")
var logger = require('morgan');
const cors = require('cors')
require('./socket')
const {
  mongoose
} = require('./plugins/db')
const {
  maxFileSize
} = require("./config")
const {
  getPuKeySync
} = require("./core/rsa-getKey")
//设置上传错误表
const ERROR_CODE_MAP = {
  'LIMIT_FILE_SIZE': `文件大小超过规定大小，请不要超过 ${maxFileSize} bytes`
}
const ERROR_STATUS_MAP = {
  '401': "无权限操作,请先登录"
}
const QUE_MAP = {
  "username": "用户名",
  "email": "邮箱",
  "nikname": "昵称"
}
var app = express();
app.use(cors({
  "origin": true, //true 设置为 req.origin.url
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE", //容许跨域的请求方式
  "allowedHeaders": "x-requested-with,Authorization,token, content-type", //跨域请求头
  "preflightContinue": false, // 是否通过next() 传递options请求 给后续中间件 
  "maxAge": 1728000, //options预验结果缓存时间 20天
  "credentials": true, //携带cookie跨域
  "optionsSuccessStatus": 200 //options 请求返回状态码
}))
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//添加upload开放的公开地址
app.use(express.static(path.join(__dirname, 'upload')));
var indexRouter = require('./routes/index');

let getPuRouter = require('./routes/getPukey');

//中间件 name+Middleware
let {
  resourceMiddleware
} = require('./middleware/midsource');
//路由 name+router
let {
  busRoute
} = require('./routes/bus')
let adminRoute = require('./routes/admin');
let pubKeyRoute = require('./routes/getPukey');
let uploadRoute = require('./routes/upload');
let likeRoute = require('./routes/artLikes');
let searchRoute = require('./routes/search');
let indexRoute = require('./routes/index');
let userRoute = require('./routes/user');
const User = require('./models/User');


app.use(
  expressJWT({
    secret: getPuKeySync(),
    algorithms: ["RS256"],
    isRevoked: async (req, payload, next) => {
      let {
        _id
      } = payload
      req._id = _id
      req.isPass = true
      try {
        let result = await User.findById(_id)
        if (!result) {
          req.isPass = false
        }
        next()
      } catch (err) {
        next(err)
      }
    },
  }).unless({
    path: [{
        url: /\/api\/rest\/comments.*/,
        methods: ['GET']
      },
      {
        url: /\/api\/rest\/columns.*/,
        methods: ['GET']
      },
      {
        url: /\/api\/rest\/articles.*/, //
        methods: ['GET']
      },
      {
        url: /\/admin.*/,
      },
      {
        url: '/keys',
      },
      {
        url: '/likes',
      },
      {
        url: '/search',
      },
      {
        url: '/api2', //测试端口
      },


    ]
  })
);
app.use('/', indexRouter);
app.use('/getPukey', getPuRouter);

//资源路由
app.use('/api/rest/:resource', resourceMiddleware, busRoute);

//登录注册
app.use('/admin', adminRoute)

//获取公钥
app.use('/keys', pubKeyRoute)

//文件上传接口
app.use('/upload', uploadRoute)

//点赞接口
app.use('/likes', likeRoute)
//自动登录接口
app.use('/index', indexRoute)

//搜索接口
app.use('/search', searchRoute)
//个人信息接口
app.use('/user', userRoute)
//无token的设置端口
app.use('/api2', (req, res, next) => {
  console.log('1')
  res.send(200, {
    message: "ok"
  })
})




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message;
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page 返回JSON文件
  console.log(err)
  if (err.message.indexOf('duplicate key error') !== -1) {
    let repeatKey = Object.entries(err.keyPattern)?.map(([key, value]) => {
      return `${QUE_MAP[key]}已存在`
    })[0];
    err.status = 422
    err.message = repeatKey
  }
  if (err.errors) {
    let message = Object.entries(err.errors).reduce((acc, [key, val]) => {
      acc += `${val.message} `
      return acc
    }, '')
    err.status = 422
    err.message = message
  }
  if (err.code in ERROR_CODE_MAP) {
    err.status = 422;
    err.message = ERROR_CODE_MAP[err.code]
  }
  if (err.status in ERROR_STATUS_MAP) {
    err.message = ERROR_STATUS_MAP[err.status]
  }
  if (/UnprocessableEntityError/g.test(err)) {
    err.status = 422;
    err.message = err.toString().replace(/UnprocessableEntityError:/g, '')
  }
  res.status(err.status || 500).send({
    code: err.status,
    message: err.message
  })
  // res.render('error');
});

module.exports = app;

/* 
   1.将登录和注册接口合并
   2.错误都放到app上

*/