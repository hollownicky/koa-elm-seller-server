const nodemailer = require('nodemailer')
const svgCaptcha = require('svg-captcha')

/**
 * 生成svg图片格式的验证码
 * @returns 
 */
const createSvgCode = () => {
  const svgCode = svgCaptcha.create({
    size: 4,
    fontSize: 60,
    noise: 1,
    color: true,
    background: 'transparent',
    ignoreChars: '0o1iIl' // 忽略容易认错的字符
  })
  return svgCode
}

/**
 * 发送邮箱
 * @param {*} email 
 * @param {*} code 
 */
const transporter = nodemailer.createTransport({
  host: 'smtp.163.com', // 发送邮箱类型(163网易邮箱), smtp.qq.com...
  port: 465, // 端口号
  secure: true, // true指向465, false指向587【固定】
  auth: {
    user: 'hollownicky@163.com', // 邮箱
    pass: 'SSKPOAJQJPMWPKAK' // smtp 验证码【网易邮箱-设置-POP3/SMTP/IMAP-新增授权密码查看】
  }
})
const sendEmail = (email, code) => {
  const params = {
    from: '"验证信息" <hollownicky@163.com>', // 邮件名称 & 发件人邮箱地址
    to: `hollownicky@163.com, ${email}`, // 收件人邮箱地址（这里的email是方法的参数, 代表收件人的邮箱地址）, 出现504, 选择性抄送一份给自己
    subject: '邮箱验证码',
    text: `您的验证码：${code} (有效期十分钟)`
  }
  return new Promise((resolve, reject) => {
    transporter.sendMail(params, (err, data) => {
      if (err) {
        reject(err)
      }
      resolve(data)
    })
  })
}

module.exports = {
  sendEmail,
  createSvgCode
}