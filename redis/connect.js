/**@format 可放在 app.js 中链接*/

const Redis = require('ioredis')

const redis = new Redis({
  port: 6379,
  host: '127.0.0.1'
})

redis.on('connect', () => {
  console.log('CONNECT IOREDIS SUCCESS')
})

module.exports = redis

