/**@format 秒杀
 * 参考：https://segmentfault.com/a/1190000040235576
*/

const ResultModal = require('../utils/result')
const { CODE_TYPES } = require('../constant/errorCode')
const Op = require('sequelize').Op
const moment = require('moment')
const { v4: uuidv4 } = require('uuid')
// 引入避免超卖lua脚本
const redis = require('./connect')
const { stockLua, lockLua, unlockLua } = require('./lua/index')

/**
 * 普通秒杀
 */
class SecKill {
  async doSecKill(ctx, next) {
    const { token } = ctx.query
    const { path } = ctx.request.body
    const { goodId } = ctx.params
    
    if (!token || !path) {
      return ctx.body = ResultModal.error(CODE_TYPES.ERROR_PARAMS, '参数错误~')
    }
    // 判断此产品是否加入了抢购
    // Error: 直接在 MySql 中查询, 会因为是在秒杀场景下, 并发会很高, 大量的请求到数据库, 显然 MySql 是扛不住的, 毕竟 MySql 每秒只能支撑千级别的并发请求
    const secKill = await SecKillModel.findOne({
      where: {
        fkGoodId: goodId // 商品ID
      }
    })
    if (!secKill) {
      return ctx.body = ResultModal.error(CODE_TYPES.ERROR_SYSTEM, '该产品并未有抢购活动~')
    }
    if (!secKill.isValid) {
      return ctx.body = ResultModal.error(CODE_TYPES.ERROR_SYSTEM, '活动已结束~')
    }
    if (moment().isBefore(moment(secKill.startTime))) {
      return ctx.body = ResultModal.error(CODE_TYPES.ERROR_SYSTEM, '活动尚未开始~')
    }
    if (moment().isAfter(moment(secKill.endTime))) {
      return ctx.body = ResultModal.error(CODE_TYPES.ERROR_SYSTEM, '活动已结束~')
    }
    if (secKill.amount < 1) {
      return ctx.body = ResultModal.error(CODE_TYPES.ERROR_SYSTEM, '产品已售罄~')
    }
    // 获取登录用户信息(这一步只是简单模拟验证用户身份, 实际开发中要有严格的token校验流程)
    const userInfo = await UserModule.getUserInfo(token)
    if (!userInfo) {
      return ctx.body = ResultModal.error(CODE_TYPES.ERROR_SYSTEM, '用户不存在~')
    }
    // 判断登录用户是否已抢到（一个用户针对这次活动只能购买一次）
    // Error: 在高并发下同一个用户上个订单还没有生成成功, 再次判断是否抢到依然会判断为否这种情况下代码并没有对扣减和下单操作做任何限制, 因此就产生了单个用户购买多个产品的情况
    const orderInfo = await OrderModel.findOne({
      where: {
        userId: userInfo.id, // 用户ID
        secKillId: secKill.id // 秒杀活动ID
      }
    })
    if (orderInfo) {
      return ctx.body = ResultModal.error(CODE_TYPES.ERROR_SYSTEM, '已抢到该产品, 无需再抢~')
    }
    // 扣库存【秒杀实例】自减方法decrement, 自增是increment
    // Error: 假设同时有1000个请求, 这1000个请求在判断产品是否秒杀完的时候查询到的库存都是200, 因此这些请求都会执行步骤8扣减库存, 那库存肯定会变成负数, 也就是产生了超卖现象
    const newSecKill = await secKill.decrement('amount')
    if (newSecKill.amount < 1) {
      return ctx.body = ResultModal.error(CODE_TYPES.ERROR_SYSTEM, '产品已售罄~')
    }
    // 下单
    const orderData = {
      orderNo: Date.now() + random_String(4), // 这里就用当前时间戳加4位随机数作为订单号, 实际开发中根据业务规划逻辑 
      status: 1, // -1已取消、0未付款、1已付款、2已退款
      orderType: 2, // 1常规订单、2秒杀订单
      goodId: goodId, // 产品ID
      userId: userInfo.id, // 用户ID
      secKillId: secKill.id, // 秒杀活动ID
      comment: '' // 备注
    }
    const order = OrderModel.create(orderData)
    if (!order) {
      return ctx.body = ResultModal.error(CODE_TYPES.ERROR_SYSTEM, '抢购失败~')
    }

    ctx.body = ResultModal.success({ path, data: '抢购成功!' })
  }
}

/**
 * Redis秒杀解决如下问题
 * 参考：https://segmentfault.com/a/1190000040235576
 */
class SecKill {
  async doSecKill(ctx, next) {
    const { token } = ctx.query
    const { path } = ctx.request.body
    const { goodId } = ctx.params

    if (!token || !path) {
      return ctx.body = ResultModal.error(CODE_TYPES.ERROR_PARAMS, '参数错误~')
    }
    // 判断产品是否加入了抢购 => 改为去 Redis 中查询
    const key = `SEC_KILL_GOOD_${goodId}`
    const secKill = await redis.hgetall(key)
    if (!checkObjNull(secKill)) {
      return ctx.body = ResultModal.error(CODE_TYPES.ERROR_PARAMS, '该产品并未有抢购活动~')
    }
    if (!secKill.isValid) {
      return ctx.body = ResultModal.error(CODE_TYPES.ERROR_SYSTEM, '活动已结束~')
    }
    if (moment().isBefore(moment(secKill.startTime))) {
      return ctx.body = ResultModal.error(CODE_TYPES.ERROR_SYSTEM, '活动尚未开始~')
    }
    if (moment().isAfter(moment(secKill.endTime))) {
      return ctx.body = ResultModal.error(CODE_TYPES.ERROR_SYSTEM, '活动已结束~')
    }
    if (secKill.amount < 1) {
      return ctx.body = ResultModal.error(CODE_TYPES.ERROR_SYSTEM, '产品已售罄~')
    }
    //获取登录用户信息(这一步只是简单模拟验证用户身份, 实际开发中要有严格的token校验流程)
    const userInfo = await UserModule.getUserInfo(token)
    if (!userInfo) {
      return ctx.body = ResultModal.error(CODE_TYPES.ERROR_SYSTEM, '用户不存在~')
    }
    // 判断登录用户是否已抢到（一个用户针对这次活动只能购买一次）=> 因为不再维护抢购活动ID，所以改为使用用户ID、产品ID和状态status判断
    const orderInfo = await OrderModel.findOne({
      where: {
        goodId: goodId,
        userId: userInfo.id,
        status: { [Op.between]: ['0', '1'] }
      }
    })
    if (orderInfo) {
      return ctx.body = ResultModal.error(CODE_TYPES.ERROR_SYSTEM, '已抢到该产品, 无需再抢~')
    }
    // 加锁, 实现一个用户针对这次活动只能购买一次
    const lockKey = `lockby:${userInfo.id}:${goodId}` // 锁的key有用户id和商品id组成
    const uuid = uuidv4()
    const expireTime = moment(secKill.endTime).diff(moment(), 'minutes') // 锁存在时间为当前时间和活动结束的时间差
    const tryLock = await redis.eval(lockLua, 2, [lockKey, 'releaseTime', uuid, expireTime])
    try {
      if (tryLock === 1) {
        // 扣库存 => 改为使用 lua 脚本去 Redis 中扣库存
        const newSecKill = await redis.eval(stockLua, 2, [key, 'amount', '', ''])
        if (newSecKill.amount < 1) {
          return ctx.body = ResultModal.error(CODE_TYPES.ERROR_SYSTEM, '产品已售罄~')
        }
        // 下单
        const orderData = {
          orderNo: Date.now() + random_String(4), // 这里就用当前时间戳加4位随机数作为订单号, 实际开发中根据业务规划逻辑 
          goodId: goodId, // 产品ID
          userId: userInfo.id, // 用户ID
          status: 1, // -1已取消、0未付款、1已付款、2已退款
          orderType: 2, // 1常规订单、2秒杀订单
          secKillId: secKill.id, // 秒杀活动ID
          comment: '' // 备注
        }
        const order = OrderModel.create(orderData)
        if (!order) {
          return ctx.body = ResultModal.error(CODE_TYPES.ERROR_SYSTEM, '抢购失败~')
        }
      }
    } catch(e) {
      await redis.eval(unlockLua, 1, [lockKey, uuid])
      return ctx.body = ResultModal.error(CODE_TYPES.ERROR_SYSTEM, '产品已售罄~')
    }

    ctx.body = ResultModal.success({ path, data: '抢购成功!' })
  }
}

module.exports = new SecKill()
