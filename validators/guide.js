const { Joi } = require('celebrate')

const create = Joi.object().keys({

  userId: Joi.string().required(),
  titleEn: Joi.string().required(),
  titleCn: Joi.string(),
  textEn: Joi.string().required(),
  textCn: Joi.string(),
  categoryId: Joi.string().required(),
  typeId: Joi.string().required(),
  thumbnail: Joi.string(),

})

module.exports = {
  create
}
