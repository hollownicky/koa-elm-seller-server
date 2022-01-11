const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { omit } = require('lodash')
const ResultModal = require('../utils/result')
const { createSvgCode, sendEmail } = require('../utils/helper')
const { CODE_TYPES } = require('../constant/errorCode')
const { OPERATE_TYPE, TWO_MINUTES } = require('../constant')
const AdminModel = require('../model/admin')
const { secretKey, expiresIn } = require('../config/index')
const KoaRedis = require('koa-redis')
const Client = new KoaRedis().client

// 缓存验证码信息，判断值与实效性
// Map(1) { 'HOOD' => { code: 'HOOD', createTime: 1641534652573 } }
const svgCodeMapList = new Map()

// 缓存邮箱验证码信息，判断值与实效性
// Map(1) { 'hollownicky@163.com' => { code: '8273', email 'hollownicky@163.com', createTime: 1641534652573 } }
const emailCodeMapList = new Map()

class AdminController {
  /**
   * 登录(重点)
   * @param {*} ctx 
   */
  async login(ctx) {
    const { username, password } = ctx.request.body
    const admin = await AdminModel.findOne({ username })
    // 没有则创建新用户
    if (!admin) {
      // 加密密码
      const hashPassword = bcrypt.hashSync(password, 10)
      const newUser = await AdminModel.create({ username, password: hashPassword })
      // jwt signature 签名, 用户信息包含昵称、角色、等级
      const token = jwt.sign({ username, role: newUser.role, level: newUser.level }, secretKey, { expiresIn })
      // Client.set('Token', token) // redis 存储
      return ctx.body = ResultModal.success({
        token,
        admin: omit(newUser.toObject(), ['password'])
      })
    }
    // 比较原密码是否正确
    if (!bcrypt.compareSync(password, admin.password)) {
      return ctx.body = ResultModal.error(CODE_TYPES.ERROR_OLD_PASSWORD, '账号或密码错误')
    }
    const user = admin.toObject()
    const token = jwt.sign(user, secretKey, { expiresIn })
    // Client.set('Token', token) // redis 存储
    ctx.body = ResultModal.success({
      token,
      admin: omit(admin.toObject(), ['password'])
    })
  }

  /**
   * 查询管理员列表
   * @param {*} ctx 
   */
  async getAdminList(ctx) {
    const { level } = ctx.state.adminInfo
    const result = await AdminModel.find({
      level: {
        $lte: level
      }
    })
    ctx.body = ResultModal.success(result)
  }

  /**
   * 更新密码
   * @param {*} ctx 
   */
  async updatePassword(ctx) {
    const { id } = ctx.params
    const { oldPassword, newPassword } = ctx.request.body

    const admin = await AdminModel.findById(id)

    // 比较原密码是否正确
    if (!bcrypt.compareSync(oldPassword, admin.password)) {
      return ctx.body = ResultModal.error(CODE_TYPES.ERROR_OLD_PASSWORD)
    }
    // 加密新密码
    const hashPassword = bcrypt.hashSync(newPassword, 10)
    await AdminModel.findByIdAndUpdate(id, { password: hashPassword })
    ctx.body = ResultModal.success(true)
  }

  /**
   * 更新用户名
   * @param {*} ctx 
   */
  async updateAccount(ctx) {
    const { id } = ctx.params
    const { username } = ctx.request.body
    await AdminModel.findByIdAndUpdate(id, { username })
    ctx.body = ResultModal.success(true)
  }

  /**
   * 获取随机验证码
   * svgCode = { text, data }
   * @param {*} ctx 
   */
  getSvgCode(ctx) {
    const svgCode = createSvgCode()
    // 可以操作 response 返回值
    const res = ctx.response
    res.type = 'image/svg+xml'
    const text = svgCode.text.toUpperCase()
    const map = {
      code: text,
      createTime: Date.now()
    }
    // 缓存验证码信息
    svgCodeMapList.set(text, map)
    ctx.body = ResultModal.success(svgCode.data)
  }

  /**
   * 发送邮箱
   * @param {*} ctx 
   */
  async sendEmail(ctx) {
    const { email, type } = ctx.request.body
    const admin = await AdminModel.findOne({ email })
    if (type === OPERATE_TYPE.ADD) {
      if (admin) {
        return ctx.body = ResultModal.error(CODE_TYPES.ERROR_SYSTEM, '该邮箱账号已存在')
      }
    } else if (type === OPERATE_TYPE.UPDATE) {
      if (!admin) {
        return ctx.body = ResultModal.error(CODE_TYPES.ERROR_SYSTEM, '该邮箱账号不存在')
      }
    }
    const code = Math.random().toString().substring(2, 6) // 随机密码
    const data = await sendEmail(email, code)
    if (!data) {
      return ctx.body = ResultModal.error(CODE_TYPES.ERROR_SYSTEM, '发送验证码失败')
    }
    const map = {
      code,
      email,
      createTime: Date.now()
    }
    // 缓存邮箱密码
    emailCodeMapList.set(email, map)
    ctx.body = ResultModal.success(true)
  }

  /**
   * 检查验证码实效性
   * @param {*} svgCode 
   */
  checkSvgCode(svgCode) {
    let valid = false
    if (svgCode) {
      const upperCode = svgCode.toUpperCase()
      const mapCode = svgCodeMapList.get(upperCode)
      if (mapCode) {
        if (Date.now() - mapCode.createTime <= TWO_MINUTES) {
          valid = true
        } else {
          svgCodeMapList.delete(upperCode)
          ctx.body = ResultModal.error(CODE_TYPES.ERROR_SYSTEM, '验证码超时')
        }
      } else {
        ctx.body = ResultModal.error(CODE_TYPES.ERROR_SYSTEM, '验证码错误')
      }
    } else {
      ctx.body = ResultModal.error(CODE_TYPES.ERROR_SYSTEM, '请输入验证码')
    }
    return valid
  }

  /**
   * 检查邮箱密码实效性
   * @param {*} email 
   * @param {*} emailCode 
   */
  checkEmailCode(email, emailCode) {
    let valid = false
    if (email && emailCode) {
      const mapEmail = emailCodeMapList.get(email)
      if (mapEmail) {
        if (Date.now() - mapEmail.createTime <= TWO_MINUTES) {
          valid = true
        } else {
          emailCodeMapList.delete(email)
          ctx.body = ResultModal.error(CODE_TYPES.ERROR_SYSTEM, '验证码超时')
        }
      } else {
        ctx.body = ResultModal.error(CODE_TYPES.ERROR_SYSTEM, '验证码错误')
      }
    } else {
      ctx.body = ResultModal.error(CODE_TYPES.ERROR_SYSTEM, '请输入邮箱及验证码')
    }
    return valid
  }
}

module.exports = new AdminController()