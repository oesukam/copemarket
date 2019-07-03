const mongoose = require('mongoose')
const { Joi } = require('celebrate')
let mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

//Create Schema
const schema = new Schema({
  uid: String,
  from: { type: Schema.Types.ObjectId, ref: 'User' },
  to: { type: Schema.Types.ObjectId, ref: 'User' },
  active: { type: Boolean, default: true },
  createdAt: {
    type: Date,
    default: Date.now
  },
  type: { type: String, default: 'follows' },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

schema.plugin(mongoosePaginate)
schema.pre('save', function(next) {
  next()
})
const Model = mongoose.model('Social', schema)

module.exports = Model
