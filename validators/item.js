const { Joi } = require('celebrate')

const create = Joi.object().keys({
  categoryId: Joi.string().required(),
  titleEn: Joi.string().required(),
  titleCn: Joi.string(),
  condition: Joi.string().required(),
  descriptionEn: Joi.string().required(),
  descriptionCn: Joi.string(),
  price: Joi.number().min(0),
  deliveryType: Joi.string(),
  tags: Joi.array()
    .items(Joi.string())
    .required(),
  contactEmail: Joi.string().required(),
  conctactWechat: Joi.string().required(),
  conctactPhone: Joi.string().required(),
  author: Joi.string().required(),
  thumbnail: Joi.string(),
  galley: Joi.array().items(Joi.string())
})

module.exports = {
  create
}
