module.exports = {
  mongodb: {
    port: 27017,
    host: '127.0.0.1',
    name: 'admin',
    pwd: '123456',
    dbName: 'db_elm_seller'
  },
  redis: {
    port: 6379,
    host: '127.0.0.1'
  },
  expiresIn: '2d',
  secretKey: 'secretKey'
}