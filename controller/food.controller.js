const ResultModal = require('../utils/result')
const FoodModel = require('../model/food')
const RatingModel = require('../model/rating')

class FoodController {
  /**
   * 分页获取统计的商品
   * @param {*} ctx 
   */
  async getFoodStatistic(ctx) {
    const { pageNo, pageSize } = ctx.query
    const sort = { price: -1, createdAt: -1 }
    const count = await FoodModel.count()
    // populate 联表查询
    const result = await FoodModel.find().populate('ratings').sort(sort).skip((pageNo - 1) * pageSize).limit(pageSize)
    ctx.body = ResultModal.success({
      count,
      list: result.map(v => ({
        name: v.name,
        sellCount: v.sellCount,
        ratingCount: v.rating || 0,
        highRating: parseFloat((v.ratings.filter(o => o.rateType === 0).length / v.ratings.length).toFixed(2))
      }))
    })
  }

  /**
   * 获取在售商品
   * @param {*} ctx 
   */
  async getFoodList(ctx) {
    const sort = { createdAt: -1 }
    const result = await FoodModel.find({ online: true }).sort(sort)
    ctx.body = ResultModal.success(result)
  }

  /**
   * 根据配置查询商品列表(分页)
   * @param {*} ctx 
   */
  async getFoodListByOpts(ctx) {
    const { pageNo, pageSize } = ctx.query
    const sort = { createdAt: -1 }
    const count = await FoodModel.count()
    // populate 联表查询
    const result = await FoodModel.find().populate('category').sort(sort).skip((pageNo - 1) * pageSize).limit(pageSize)
    ctx.body = ResultModal.success({
      count,
      list: result
    })
  }

  /**
   * 根据ID查询商品列表 & 该商品等级
   * @param {*} ctx 
   */
  async getFoodListById(ctx) {
    const { id } = ctx.params
    let result = await FoodModel.findById(id)
    if (result) {
      const ratings = await RatingModel.find({ foodId: result.id })
      result = result.toObject()
      result.ratings = ratings
    }
    ctx.body = ResultModal.success(result)
  }

  /**
   * 创建
   * @param {*} ctx 
   */
  async createdFood(ctx) {
    const payload = ctx.request.body
    const result = await FoodModel.create(payload)
    ctx.body = ResultModal.success(result)
  }

  /**
   * 更新
   * @param {*} ctx 
   */
  async updateFood(ctx) {
    const { id } = ctx.params
    const payload = ctx.request.body
    const result = await FoodModel.findByIdAndUpdate(id, payload)
    ctx.body = ResultModal.success(result)
  }

  /**
   * 删除
   * @param {*} ctx 
   */
  async deleteFood(ctx) {
    const { id } = ctx.params
    const result = await FoodModel.findByIdAndDelete(id)
    ctx.body = ResultModal.success(result)
  }

  /**
   * 启用
   * @param {*} ctx 
   */
  async enableFood(ctx) {
    const { id } = ctx.params
    const result = await FoodModel.findByIdAndUpdate(id, { online: true })
    ctx.body = ResultModal.success(result)
  }

  /**
   * 禁用
   * @param {*} ctx 
   */
  async disableFood(ctx) {
    const { id } = ctx.params
    const result = await FoodModel.findByIdAndUpdate(id, { online: false })
    ctx.body = ResultModal.success(result)
  }
}

module.exports = new FoodController()