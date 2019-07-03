const mongoose = require('mongoose')
const { Joi } = require('celebrate')
let mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

//Create Schema
const schema = new Schema({
  uid: String,
  name: String,
  description: String,
  keywords: { type: String, index: true },
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

function validate (schema) {
  const rules = {
    name: Joi.string().require(),
    description: Joi.string(),
  }
  return Joi.validate(schema, rules)
}

exports.Province = mongoose.model('Province', schema)
exports.validate = validate
