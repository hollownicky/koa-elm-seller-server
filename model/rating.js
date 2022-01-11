/** 评价表 */

const mongoose = require('mongoose')
const { ObjectId } = mongoose.Types
const dbName = 'Rating'

const ratingSchema = new mongoose.Schema({
  rateType: { type: Number, required: true, enum: [0, 1] }, // 0 是好评、1是差评
  username: { type: String, required: true },
  rateTime: { type: Date, required: true },
  text: String,
  avatar: String,
  deliveryTime: String, // 交付时间
  score: Number,
  recommend: [String],
  foodId: { type: ObjectId, ref: 'Food' },
  createdAt: Number,
  updatedAt: Number
}, {
  toJSON: { virtuals: true },
  timestamps: {
    currentTime: () => Date.now()
  }
})

ratingSchema.virtual('food', {
  ref: 'Food',
  localField: 'foodId',
  foreignField: '_id',
  justOne: true
})

module.exports = mongoose.model(dbName, ratingSchema, dbName)