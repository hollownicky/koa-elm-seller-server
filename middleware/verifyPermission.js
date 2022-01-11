const jwt = require('jsonwebtoken')
const ResultModal = require('../utils/result')
const { CODE_TYPES } = require('../constant/errorCode')
const { secretKey, expiresIn } = require('../config/index')

const verifyPermission = async(ctx, next) => {
  let decode = null
  let token = ctx.headers['authorization']
  token = token.split(' ')
  token = token[1] && token[1]
  try {
    decode = jwt.verify(token, secretKey, { expiresIn })
  } catch(e) {
    // 无效Token
    return ctx.body = ResultModal.error(CODE_TYPES.ERROR_INVALID_TOKEN)
  }
  if (decode?.role !== 'ROOT') {
    // 无此操作权限
    return ctx.body = ResultModal.error(CODE_TYPES.ERROR_NO_PERMISSION)
  }
  await next()
}

module.exports = verifyPermission