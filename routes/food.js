const router = require('koa-router')()
const FoodController = require('../controller/food.controller')
const { verifyParams, adminRequired, verifyPermission } = require('../middleware')

router.prefix('/api')

router.get('/admin/food-statistic', FoodController.getFoodStatistic)

router.delete('/admin/food/:id', adminRequired, verifyPermission, FoodController.deleteFood)

const createFoodParams = {
  ruleName: 'food',
  require: ['name', 'price', 'oldPrice', 'image']
}
router.post('/admin/food', adminRequired, verifyParams(createFoodParams), FoodController.createdFood)

const updateFoodParams = {
  ruleName: 'food'
}
router.patch('/admin/food/:id', adminRequired, verifyPermission, verifyParams(updateFoodParams), FoodController.updateFood)

router.get('/food', FoodController.getFoodList)

router.get('/admin/food', FoodController.getFoodListByOpts)

router.get('/admin/food/:id', FoodController.getFoodListById)

router.patch('/admin/food/:id/enable', FoodController.enableFood)

router.patch('/admin/food/:id/disable', FoodController.disableFood)

module.exports = router
