`
 MongoDB 学习教程
 https://www.yiibai.com/mongodb/mongodb-advantages-over-rdbms.html#
`
/**
 * 直连 mongodb, 了解原始方法及各操作的返回值
 */
const { MongoClient, ObjectId } = require('mongodb')
const config = require('./index').mongodb

const URI = `mongodb://127.0.0.1:27017/${config.dbName}`
MongoClient.connect(URI, async (err, db) => {
  if (err) {
    console.log('CONNECT MONGODB ERROR:', err.message)
    process.exit(1)
  } else {
    console.log(`CONNECT MONGODB SUCCESS`)
    const DataBase = db.db(config.dbName)
    const TestModal = DataBase.collection('Test')
    
    /* ************************************************************ */
    
    const res = await TestModal.updateOne(
      {
        _id: ObjectId('61ea6a947512c3c26f6984e9')
      },
      {
        $max: {
          age: 30
        }
      }
    )
    console.log('﹀﹀﹀﹀﹀﹀﹀﹀res﹀﹀﹀﹀﹀﹀﹀﹀﹀')
    console.log(res)
    console.log('︿︿︿︿︿︿︿︿res︿︿︿︿︿︿︿︿︿')

    /* ************************************************************ */
  }
})