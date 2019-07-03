const { Joi } = require('celebrate')

const create = Joi.object().keys({
  logo: Joi.string().required(),
  name: Joi.string().required(),
  nameCn: Joi.string(),
  description: Joi.string().required(),
  descriptionCn: Joi.string(),
  addressEn: Joi.string().required(),
  addressCn: Joi.string(),
  area: Joi.string(),
  location: Joi.object().keys({
    long: Joi.number(),
    lat: Joi.number()
  })
})

module.exports = {
  create
}
