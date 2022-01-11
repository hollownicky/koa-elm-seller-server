const ResultModal = require('../utils/result')
const { CODE_TYPES } = require('../constant/errorCode')
const FoodModel = require('../model/food')
const CategoryModel = require('../model/category')

class CategoryController {
  /**
   * 获取目录列表
   * @param {*} ctx 
   */
  async getCategoryList(ctx) {
    const data = await CategoryModel.find().populate('foodsCount').sort({ createTime: -1 })
    const result = data.map(v => v.toObject({ virtuals: true }))
    ctx.body = ResultModal.success(data)
  }

  /**
   * 创建目录
   * @param {*} ctx 
   */
  async createCategory(ctx) {
    const payload = ctx.request.body
    let data = null
    try {
      data = await CategoryModel.findOne({ name: payload.name })
    } catch(err) {
      throw err
    }
    if (data) {
      return ctx.body = ResultModal.error(CODE_TYPES.ERROR_REPEAT_CATEGORY)
    }
    const result = await CategoryModel.create(payload)
    ctx.body = ResultModal.success(result)
  }

  /**
   * 更新目录
   * @param {*} ctx 
   */
  async updateCategory(ctx) {
    const { id } = ctx.params // 动态参数id
    const payload = ctx.request.body

    const result = await CategoryModel.findByIdAndUpdate(id, payload)
    ctx.body = ResultModal.success(result)
  }
  
  /**
   * 删除目录
   * @param {*} ctx 
   */
  async deleteCategory(ctx) {
    const { id } = ctx.params // 动态参数id
    let data = null
    try {
      data = await FoodModel.findOne({ cateId: id })
    } catch(err) {
      throw err
    }
    if (data) {
      return ctx.body = ResultModal.error(CODE_TYPES.ERROR_DELETE_CATEGORY)
    }
    const result = await CategoryModel.findByIdAndRemove(id)
    ctx.body = ResultModal.success(result)
  }
}

module.exports = new CategoryController()