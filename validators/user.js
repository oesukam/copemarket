const { Joi } = require('celebrate')

const create = Joi.object().keys({
  firstName: Joi.string(),
  lastName: Joi.string(),
  avatar: Joi.string(),
  account: Joi.string().required(),
  password: Joi.string(),
  phone: Joi.string(),
  gender: Joi.string().valid(['male', 'female']),
  language: Joi.string(),
  dateOfBirth: Joi.date(),
  country: Joi.string(),
  province: Joi.string(),
  city: Joi.string(),
  profession: Joi.string(),
  role: Joi.array().items(Joi.number().max(100)),
  openId: Joi.string(),
  unionId: Joi.string(),
  wechatName: Joi.string(),
  wechatId: Joi.string(),
  useWechat: Joi.boolean(),
  useEmail: Joi.boolean(),
  about: Joi.string(),
  status: Joi.string()
})

const accountAndPasswordAuth = Joi.object().keys({
  account: Joi.string().required(),
  password: Joi.string().required(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  avatar: Joi.string(),
  gender: Joi.string().valid(['male', 'female']),
  dateOfBirth: Joi.date(),
  role: Joi.array().items(Joi.number().max(100))
})

const wechatAuth = Joi.object().keys({
  js_code: Joi.string().required(),
  firstName: Joi.string(),
  lastName: Joi.string(),
  avatar: Joi.string(),
  gender: Joi.string().valid(['male', 'female']),
  city: Joi.string(),
  language: Joi.string(),
  province: Joi.string(),
  wechatName: Joi.string(),
  country: Joi.string(),
  encryptedData: Joi.string(),
  iv: Joi.string()
})

module.exports = {
  create,
  wechatAuth,
  accountAndPasswordAuth
}
