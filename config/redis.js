/**
const redis = require('redis')
const koaRedis = require('koa-redis')
const koaSession = require('koa-session')

const client = redis.createClient(6379, '127.0.0.1')
client.on('connect', () => {
  console.log('CONNECT REDIS SUCCESS')
})
const store = koaRedis({ client, db: 1 })
app.use(koaSession({ store }, app))
*/
const Redis = require('ioredis')
const config = require('./index').redis

const redis = new Redis({
  port: config.port,
  host: config.host
})
redis.on('connect', () => {
  console.log('CONNECT IOREDIS SUCCESS')
})