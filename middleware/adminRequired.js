const jwt = require('jsonwebtoken')
const ResultModal = require('../utils/result')
const { CODE_TYPES } = require('../constant/errorCode')
const { secretKey, expiresIn } = require('../config/index')

const adminRequired = async(ctx, next) => {
  let decode = null
  let token = ctx.headers['authorization']
  if (!token) {
    return ctx.body = ResultModal.error(CODE_TYPES.ERROR_INVALID_TOKEN) // 无效Token
  }
  token = token.split(' ')
  token = token[1] && token[1]
  try {
    decode = jwt.verify(token, secretKey, { expiresIn })
  } catch(err) {
    if (err.name === 'TokenExpiredError') {
      return ctx.body = ResultModal.error(CODE_TYPES.ERROR_EXPIRED_TOKEN) // 过期Token
    }
    return ctx.body = ResultModal.error(CODE_TYPES.ERROR_INVALID_TOKEN) // 无效Token
  }
  /**
   * /login 签名 token 包含以下信息
   * { username, role: newUser.role, level: newUser.level }
   */
  ctx.state.adminInfo = decode
  await next()
}

module.exports = adminRequired