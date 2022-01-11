const { pick, cloneDeep } = require('lodash')
const validateRules = require('../constant/validateRules')

const verifyParams = (options = {}) => {
  const { ruleName, required, validateFields } = options

  if (!validateRules.hasOwnProperty(ruleName)) {
    throw new Error(`Not Found this ruleName: ${ruleName}`)
  }

  let rules = cloneDeep(validateRules[ruleName])
  if (Array.isArray(validateFields)) {
    rules = pick(rules, validateFields)
  }

  if (Array.isArray(required)) {
    required.forEach(key => {
      if (rules.hasOwnProperty(key)) {
        rules[key].required = true
      }
    })
  }

  return async(ctx, next) => {
    if (!rules) {
      return await next()
    }
    ctx.verifyParams(rules)
    return await next()
  }
}

module.exports = verifyParams