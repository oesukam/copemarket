const mongoose = require('mongoose')
let mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

//Create Schema
const schema = new Schema({
  uid: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  item: { type: Schema.Types.ObjectId, ref: 'Item' },
  active: { type: Boolean, default: true },
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
const Model = mongoose.model('Like', schema)

module.exports = Model
