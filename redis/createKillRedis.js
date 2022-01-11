const redis = require('./connect')

const run = async () => {
  goodId = '61c439d0ba92f5ab632e63a7'
  const data = {
    fkGoodId: goodId, // 秒杀商品ID
    amount: 200, // 库存数
    startTime: '2021-12-24 00:00:00', // 秒杀开始时间
    endTime: '2021-12-26 00:00:00', // 秒杀结束时间
    isValid: 1, // 秒杀是否有效
    comment: '秒杀活动数据'
  }
  
  // 往 Redis 内存入 key 为 `SEC_KILL_GOOD_${goodId}` 的 hash 类型秒杀活动数据
  await redis.hmset(`SEC_KILL_GOOD_${goodId}`, data)
}

run().then(() => {
  process.exit()
})