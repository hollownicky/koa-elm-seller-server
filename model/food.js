/** 食品表 */

const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types
const dbName = 'Food'

const foodSchema = new mongoose.Schema({
  name: String,
  image: String,
  desc: String,
  price: Number,
  oldPrice: Number,
  sellCount: Number,
  info: String,
  rating: Number, // 评级
  cateId: ObjectId, // 等于 Category _id
  online: { type: Boolean, default: true },
  createdAt: Number,
  updatedAt: Number
}, {
  toJSON: { virtuals: true },
  timestamps: {
    currentTime: () => Date.now()
  }
})

foodSchema.virtual('ratings', {
  ref: 'Rating',
  localField: '_id',
  foreignField: 'foodId'
})

foodSchema.virtual('category', {
  ref: 'Category',
  localField: 'cateId',
  foreignField: '_id',
  justOne: true
})

module.exports = mongoose.model(dbName, foodSchema, dbName)