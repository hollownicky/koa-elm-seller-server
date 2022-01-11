/** 售卖表 */

const mongoose = require('mongoose')
const dbName = 'Seller'

const sellerSchema = new mongoose.Schema({
  name: String,
  desc: String,
  deliveryTime: Number,
  score: Number,
  serviceScore: Number,
  foodScore: Number,
  rankRate: Number,
  minPrice: Number,
  deliveryPrice: Number,
  ratingCount: Number,
  sellCount: Number,
  bulletin: String,
  avatar: String,
  pics: [String],
  infos: [String],
  supports: [{ type: { type: Number }, description: String }]
}, { timestamps: true })

module.exports = mongoose.model(dbName, sellerSchema, dbName)