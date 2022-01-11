/** 目录表 */

const mongoose = require('mongoose')
const dbName = 'Category'

/**
 * timestamps 给开发带来便利，创建文档时不用在代码中去指定createTime字段的值，在更新文档时也不用去修改updateTime字段的值
 * 设置 { timestamps: true } || { timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' } } 都会自动操作
 */

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true }, // 类目名称
  type: { type: Number, required: true }, // 0-满减、1-折扣、2-特价、3-支持发票、4-外卖保
  createdAt: Number,
  updatedAt: Number
}, {
  timestamps: {
    currentTime: () => Date.now()
  }
})

categorySchema.virtual('foodsCount', { // 设置虚拟字段
  ref: 'Food',
  localField: '_id',
  foreignField: 'cateId',
  count: true
})

/**
 * virtual 属性可以从 Document 中获取并设置, 但它并不存在mongoDB中
 * virtual 的 getters 能够有效的格式化以及合并文本域
 */
/**
 categorySchema.virtual('foodsCount').get(() => {
   return this.name + ':::' + this.type
 })
*/

module.exports = mongoose.model(dbName, categorySchema, dbName)