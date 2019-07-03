const mongoose = require('mongoose')
const { Joi } = require('celebrate')
let mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

//Create Schema
const schema = new Schema({
  uid: String,
  _user: { type: Schema.Types.ObjectId, ref: 'User' },
  _city: { type: Schema.Types.ObjectId, ref: 'City' },
  _province: { type: Schema.Types.ObjectId, ref: 'Province' },
  _district: { type: Schema.Types.ObjectId, ref: 'District' },
  _category: { type: Schema.Types.ObjectId, ref: 'Category' },
  _type: { type: Schema.Types.ObjectId, ref: 'Category' },
  poster: String,
  title: String,
  description: { type: String, trim: true },
  price: { type: Number, default: 0 },
  currency: { type: String, default: 'CDF' },
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

exports.Product = mongoose.model('Product', schema)
exports.validate = validate
