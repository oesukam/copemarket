const mongoose = require('mongoose')
const { Joi } = require('celebrate')
let mongoosePaginate = require('mongoose-paginate')
const Schema = mongoose.Schema

//Create Schema
const schema = new Schema({
  uid: String,
  _province: { type: Schema.Types.ObjectId, ref: 'Province' },
  _city: { type: Schema.Types.ObjectId, ref: 'City' },
  _verifiedPhone: { type: Schema.Types.ObjectId, ref: 'Phone' },
  firstName: String,
  lastName: String,
  avatar: String,
  phone: {
    type: String,
    required: true,
    unique: true,
    index: true,
    min: 8,
    max: 13
  },
  email: {
    type: String,
    default: ''
  },
  password: {
    type: String,
    required: true
    // select: false
  },
  countryCode: {
    type: String,
    default: '243'
  },
  gender: {
    type: String,
    enum: ['male', 'female', '']
  },
  birthDate: {
    type: Date,
    default: ''
  },
  profession: String,
  about: String,
  language: { type: String, default: 'fr' },
  status: {
    type: String,
    default: 'available'
  },
  firstLogin: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  followingCount: {
    type: Number,
    default: 0
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  followersCount: {
    type: Number,
    default: 0
  },
  usePhone: {
    type: Boolean,
    default: true
  },
  loginAt: {
    type: Date,
    default: Date.now
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

schema.plugin(mongoosePaginate)
schema.pre('save', function(next) {
  next()
})

function validate (schema) {
  const rules = {
    phone: Joi.string().require(),
    email: Joi.string().email(),
    firstName: Joi.string(),
    middleName: Joi.string(),
    lastName: Joi.string(),
    gender: Joi.string(),
  }
  return Joi.validate(schema, rules)
}


exports.User = mongoose.model('User', schema)
exports.validate = validate
