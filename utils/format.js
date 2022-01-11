/**
 * 昵称脱敏
 * @param {*} name 
 * @param {*} replace 
 * @returns 
 */
const formatUsername = (name, replace = '***') => {
  let newStr = ''
  if (name.length === 2) {
    newStr = name.substr(0, 1) + replace + name.substr(-1, 1)
  } else if (name.length > 2) {
    newStr = name.substr(0, 1) + replace + name.substr(-1, 1)
  } else {
    newStr = name + replace
  }
  return newStr
}

module.exports = {
  formatUsername
}