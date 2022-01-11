/** @format 自定义LOG */
const log = require('log4js')

log.configure({
  appenders: {
    out: {
      type: 'stdout'
    },
    reqInfo: { // request info
      type: 'dateFile',
      filename: 'logs/info',
      pattern: 'YYYY/YY/dd.log',
      daysToKeep: 10,
      alwaysIncludePattern: true
    },
    resError: { // response error
      type: 'dateFile',
      filename: 'logs/info',
      pattern: 'YYYY/YY/dd.log',
      daysToKeep: 10,
      alwaysIncludePattern: true
    }
  },
  categories: {
    default: { appenders: ['out'], level: 'info' },
    reqInfo: { appenders: ['out', 'reqInfo'], level: 'info' },
    resError: { appenders: ['out', 'resError'], level: 'error' }
  },
  replaceConsole: true
})

const reqLogger = log.getLogger('reqInfo') // request logger 
const resLogger = log.getLogger('resError') // response logger 

exports.logger = resLogger

exports.use = (app) => {
  // 页面请求日志,用auto的话,默认级别是WARN
  // 这样会自动记录每次请求信息，放在其他use上面
  app.use(
    log.connectLogger(reqLogger, { level: 'INFO' })
  )
}

