const errorHandler = async(ctx, next) => {
  try {
    await next()
  } catch(err) {
    ctx.status = err.status || 500
    const response = {
      ...err,
      message: (ctx.status === 500 && process.env.NODE_ENV === 'prod') ? 'Internal server Error' : err.message
    }
    if (process.env.NODE_ENV !== 'prod' && err.stack && ctx.status === 500) {
      response.stack = err.stack
    }
    // 此处不使用 ResultModal.success 会覆盖 response 的 status、message
    ctx.body = response
  }
}

module.exports = errorHandler