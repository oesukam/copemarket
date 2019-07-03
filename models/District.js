const mongoose = require('mongoose')
const { Joi } = require('celebrate')
let mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

//Create Schema
const schema = new Schema({
  uid: String,
  name: String,
  description: String,
  likesCount: {
    type: Number,
    default: 0
  },
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

schema.plugin(mongoosePaginate)
schema.pre('save', function(next) {
  next()
})
const Model = mongoose.model('Item', schema)

module.exports = Model
