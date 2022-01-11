const router = require('koa-router')()
const SellerController = require('../controller/seller.controller')
const { verifyParams, adminRequired, verifyPermission } = require('../middleware')

router.prefix('/api')

router.get('/seller', SellerController.getSeller)

router.get('/admin/seller', SellerController.getSeller)

const updateSellerParams = {
  ruleName: 'seller'
}
router.patch('/admin/seller/:id', adminRequired, verifyPermission, verifyParams(updateSellerParams), SellerController.updateSeller)

module.exports = router
