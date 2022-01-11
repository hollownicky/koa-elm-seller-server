const router = require('koa-router')()
const RatingController = require('../controller/rating.controller')
const { adminRequired, verifyPermission } = require('../middleware')

router.prefix('/api')

router.get('/admin/rating', RatingController.getRatingList)

router.get('/admin/all-rating', RatingController.getAllRatingList)

router.delete('/admin/rating/:id', adminRequired, verifyPermission, RatingController.deleteRating)

router.post('/admin/rating', adminRequired, verifyPermission, RatingController.deleteRatingList)

module.exports = router
