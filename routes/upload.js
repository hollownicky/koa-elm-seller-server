const router = require('koa-router')()
const UploadController = require('../controller/upload.controller')
const { verifyParams, adminRequired, verifyPermission } = require('../middleware')

router.prefix('/upload')

// ...

module.exports = router
