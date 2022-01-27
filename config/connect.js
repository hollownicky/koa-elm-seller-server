const mongoose = require('mongoose')
const config = require('./index').mongodb

// 如果有专有账号密码
// const URI = `mongodb://${config.name}:${config.pwd}@127.0.0.1:27017/${config.dbName}`
const URI = `mongodb://127.0.0.1:27017/${config.dbName}`
mongoose.connect(URI, (err) => {
  if (err) {
    console.log('CONNECT MONGOOSE ERROR:', err.message)
    process.exit(1)
  } else {
    console.log(`CONNECT MONGOOSE SUCCESS`)
  }
})