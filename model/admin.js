/** 系统管理员表 */

const mongoose = require('mongoose')
const dbName = 'Admin'

/*
 createdAt 默认使用UTC通用标准时, 以Z来标识: 2020-07-06T20:36:59.414Z
 { createTime: Number, updateTime: Number },
 { createdAt: 'createTime', updatedAt: 'updateTime', currentTime: () => Math.floor(Date.now()) }
*/

const adminSchema = new mongoose.Schema({
  username: String, // 账号
  password: String, // 密码
  email: String, // 邮箱
  level: { type: Number, default: 1 }, // 等级 1-100
  role: { type: String, default: 'JUNIOR' }, // 角色 JUNIOR、SENIOR、ROOT
  createdAt: Number,
  updatedAt: Number
}, {
  timestamps: {
    currentTime: () => Date.now()
  }
})

module.exports = mongoose.model(dbName, adminSchema, dbName)