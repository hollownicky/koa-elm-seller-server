const fs = require('fs')

// 读出来的都是字符串
const stock = fs.readFileSync(__dirname + '/stock.lua', 'utf-8')
const lock = fs.readFileSync(__dirname + '/lock.lua', 'utf-8')
const unlock = fs.readFileSync(__dirname + '/unlock.lua', 'utf-8')

module.exports = {
  stockLua: stock,
  lockLua: lock,
  unlockLua: unlock
}