const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  phone: { type: String, index: true, required: true },
  code: { type: String, default: '243' },
  smsCode: { type: String, default: '' },
  verified: { type: Boolean, default: false },
  seconds: { type: Number, default: 180 },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

exports.Phone = mongoose.model('Phone', schema)
