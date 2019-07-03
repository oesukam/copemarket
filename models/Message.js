const mongoose = require('mongoose')
let mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

const schema = new Schema({
  image: String,
  topic: String,
  from: { type: Schema.Types.ObjectId, ref: 'User' },
  to: { type: Schema.Types.ObjectId, ref: 'User' },
  item: { type: Schema.Types.ObjectId, ref: 'Item' },
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
const Model = mongoose.model('Conversation', schema)

module.exports = Model
