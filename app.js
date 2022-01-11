const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyParser = require('koa-bodyparser')
const logger = require('koa-logger')
const parameter = require('koa-parameter')
const moment = require('moment')
const config = require('./config/index').mongodb
// const getEurekaClient = require('./eureka')

const admin = require('./routes/admin')
const category = require('./routes/category')
const food = require('./routes/food')
const rating = require('./routes/rating')
const seller = require('./routes/seller')
const upload = require('./routes/upload')

// 数据库连接
require('./config/connect')
// redis 连接
require('./config/redis')
// 跨域处理
require('./config/cors')

// error handler
onerror(app)

/* middleware start */
app.use(bodyParser({
  enableTypes:['json', 'form', 'text']
}))

app.use(logger((str, args) => {
  console.log(moment().format('YYYY-MM-DD HH:mm:ss'))
}))
app.use(parameter(app))

app.use(json())

app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))
/* middleware end */

/* 设置路由 start */
app.use(admin.routes(), admin.allowedMethods())
app.use(category.routes(), category.allowedMethods())
app.use(food.routes(), food.allowedMethods())
app.use(rating.routes(), rating.allowedMethods())
app.use(seller.routes(), seller.allowedMethods())
app.use(upload.routes(), upload.allowedMethods())
/* 设置路由 end */

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'prod') {
  // 监听成功后执行回调
  app.listen(config.port, () => {
    try {
      // getEurekaClient()
      console.log('SUCCESS')
    } catch(e) {
      console.error(e.name)
    }
    console.log('koa-love listening on port', config.port)
    console.log('God bless love....')
  })
}

module.exports = app
