const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  token: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  valid: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

exports.Token = mongoose.model('Token', schema)
