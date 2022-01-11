const ResultModal = require('../utils/result')
const { CODE_TYPES } = require('../constant/errorCode')
const FoodModel = require('../model/food')
const SellerModel = require('../model/seller')

class SellerController {
  /**
   * 获取售卖信息
   * @param {*} ctx 
   */
  async getSeller(ctx) {
    const foodList = await FoodModel.find()
    const totalPrice = foodList.reduce((prev, cur) => {
      let amount = cur.price * cur.sellCount
      amount = Number.isNaN(amount) ? 0 : amount
      return amount + prev
    }, 0)
    const totalSellCount = foodList.reduce((prev, cur) => {
      return prev + (cur.sellCount || 0)
    }, 0)
    const foodCount = await FoodModel.count()
    const sellerResult = await SellerModel.findOne()
    if (!sellerResult) {
      return ctx.body = ResultModal.error(CODE_TYPES.ERROR_INIT_SELLER)
    }
    const sellerInfo = sellerResult && sellerResult.toObject()
    ctx.body = ResultModal.success({
      ...sellerInfo,
      foodCount,
      totalPrice,
      totalSellCount
    })
  }

  /**
   * 更新售卖信息
   * @param {*} ctx 
   */
  async updateSeller(ctx) {
    const { id } = ctx.params
    const { bulletin, deliveryPrice, infos, minPrice, name, pics, supports, avatar } = ctx.request.body
    const payload = { bulletin, deliveryPrice, infos, minPrice, name, pics, supports, avatar }
    await SellerModel.findByIdAndUpdate(id, payload)
    ctx.body = ResultModal.success(true)
  }
}

module.exports = new SellerController()