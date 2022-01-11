const router = require('koa-router')()
const AdminController = require('../controller/admin.controller')
const { verifyParams, adminRequired, verifyPermission } = require('../middleware')

router.prefix('/admin')

const loginParams = {
  ruleName: 'admin',
  required: ['username', 'password'],
  validateFields: ['username', 'password']
}
router.post('/login', verifyParams(loginParams), AdminController.login)

const updateAccountParams = {
  ruleName: 'admin',
  required: ['username'],
  validateFields: ['username']
}
router.patch('/:id/update-account', adminRequired, verifyPermission, verifyParams(updateAccountParams), AdminController.updateAccount)

const updatePasswordParams = {
  ruleName: 'admin',
  required: ['oldPassword', 'newPassword'],
  validateFields: ['oldPassword', 'newPassword'],
}
router.patch('/:id/update-password', adminRequired, verifyPermission, verifyParams(updatePasswordParams), AdminController.updatePassword)

router.get('/admin-list', adminRequired, AdminController.getAdminList)

/* 获取svg验证码, 不需要权限 */
router.get('/svg-code', AdminController.getSvgCode)

/* 发送邮箱密码, 不需要权限 */
router.post('/send-email', AdminController.sendEmail)

module.exports = router
