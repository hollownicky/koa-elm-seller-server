const router = require('koa-router')()
const CategoryController = require('../controller/category.controller')
const { verifyParams, adminRequired, verifyPermission } = require('../middleware')

router.prefix('/category')

const createCategoryParams = {
  ruleName: 'category',
  require: ['name', 'type']
}
router.post('/create-category', adminRequired, verifyParams(createCategoryParams), CategoryController.createCategory)

router.get('/category-list', CategoryController.getCategoryList)

router.patch('/:id', adminRequired, verifyPermission, CategoryController.updateCategory)

router.delete('/:id', adminRequired, verifyPermission, CategoryController.deleteCategory)

module.exports = router
