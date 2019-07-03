const mongoose = require('mongoose')
const { Joi } = require('celebrate')
let mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

//Create Schema
const schema = new Schema({
  _parent: { type: Schema.Types.ObjectId, ref: 'Category' },
  parent: { type: Schema.Types.ObjectId, ref: 'Category' },
  icon: String,
  poster: String,
  name: String,
  description: String,
  itemsNumber: { type: Number, default: 0 },
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

exports.Category = mongoose.model('Category', schema)
exports.validate = validate
