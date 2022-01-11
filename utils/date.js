const moment = require('moment')

/**
 * 获取当日日期: 2022/01/07
 * @returns 
 */
const getToday = () => {
  return moment().format('YYYY/MM/DD')
}

/**
 * 获取当前具体时间: 2022/01/07 21:22:02
 * @returns 
 */
const getCurrentDate = () => {
  return moment().format('YYYY/MM/DD HH:mm:ss')
}

/**
 * 获取时间戳
 * 入参: 2022/01/07 或 2022/01/07 21:22:02
 * @param {*} date 
 * @returns 
 */
const getTimeStamp = (date) => {
  return moment(date).valueOf()
}

module.exports = {
  getToday,
  getTimeStamp,
  getCurrentDate
}