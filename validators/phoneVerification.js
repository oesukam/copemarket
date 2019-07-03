const { Joi } = require('celebrate')

const create = Joi.object().keys({
  user: Joi.string(),
  countryCode: Joi.string(),
  phoneNumber: Joi.string(),
  action: Joi.string()
})

const update = Joi.object().keys({
  user: Joi.string(),
  countryCode: Joi.string(),
  phoneNumber: Joi.string(),
  action: Joi.string(),
  verificationCode: Joi.string()
})

const wechat = Joi.object().keys({
  user: Joi.string(),
  js_code: Joi.string().required(),
  encryptedData: Joi.string(),
  iv: Joi.string()
})

module.exports = {
  create,
  update,
  wechat
}
