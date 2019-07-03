const mongoose = require('mongoose')
let mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

const schema = new Schema({
  conversation: {
    type: Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  image: String,
  text: { type: String, required: true },
  read: {
    type: Boolean,
    default: false
  },
  fromDeleted: { type: Boolean, default: false },
  toDeleted: { type: Boolean, default: false },
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
const Message = mongoose.model('Message', schema)

module.exports = Message
