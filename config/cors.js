const Koa = require('koa')
const app = new Koa()
const cors = require('koa2-cors')

app.use(
  cors({
    origin: (ctx) => { // 设置允许来自指定域名请求
      return '*' // '*' 允许所有，可设置 "http://localhost:3000"
    },
    maxAge: 5, // 指定本次【预检请求】的有效期, 单位为秒
    credentials: false, // 是否允许发生 Cookies
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // 允许通过的 HTTP 请求类型
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'], // 允许通过的头信息字段
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] // 设置获取其他自定义字段
  })
)
