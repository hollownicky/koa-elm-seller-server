const mysql = require('mysql')
const config = require('./index').mysql

const connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database
})

connection.connect(err => {
  if (err) {
    console.log('CONNECT MYSQL ERROR:', err)
    process.exit(1)
  } else {
    console.log(`CONNECT MYSQL SUCCESS`)
  } 
})
