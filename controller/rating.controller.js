const ResultModal = require('../utils/result')
const RatingModel = require('../model/rating')

class RatingController {
  /**
   * 获取评价列表(分页)
   * @param {*} ctx 
   */
  async getRatingList(ctx) {
    const { pageNo, pageSize } = ctx.query
    const sort = { createdAt: -1 }
    const count = await RatingModel.count()
    // populate 联表查询
    const result = await RatingModel.find().populate('food').sort(sort).skip((pageNo - 1) * pageSize).limit(pageSize)
    ctx.body = ResultModal.success({
      count,
      list: result
    })
  }

  /**
   * 获取所有评价列表
   * @param {*} ctx 
   */
   async getAllRatingList(ctx) {
    const sort = { createdAt: -1 }
    const result = await RatingModel.find().sort(sort)
    ctx.body = ResultModal.success({
      list: result
    })
  }

  async deleteRating(ctx) {
    const { id } = ctx.params
    const result = await RatingModel.findByIdAndDelete(id)
    ctx.body = ResultModal.success(result)
  }

  async deleteRatingList (ctx) {
    const { ids } = ctx.request.body
    await Promise.all(ids.map(id => RatingModel.findByIdAndDelete(id)))
    ctx.body = ResultModal.success(true)
  }
}

module.exports = new RatingController()