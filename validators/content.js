const { Joi } = require('celebrate')

const create = Joi.object().keys({
  titleEn: Joi.string().required(),
  titleCn: Joi.string(),
  textEn: Joi.string().required(),
  textCn: Joi.string(),
  userId: Joi.string().required(),
  categoryId: Joi.string().required(),

})

module.exports = {
  create
}
