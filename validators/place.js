const { Joi } = require('celebrate')

const create = Joi.object().keys({
  category: Joi.string().required(),
  type: Joi.string().required(),
  name: Joi.string().required(),
  thumbnail: Joi.string().required(),
  averageExpense: Joi.number(),
  openFrom: Joi.string().required(),
  openTo: Joi.string().required(),
  phone: Joi.string(),
  tags: Joi.array().items(Joi.string()),
  addressEn: Joi.string().required(),
  addressCn: Joi.string(),
  province: Joi.string(),
  city: Joi.string(),
  district: Joi.string(),
  area: Joi.string(),
  street: Joi.string(),
  author: Joi.string(),
  gallery: Joi.array(),
  keywords: Joi.string(),
  description: Joi.string().required(),
  descriptionCn: Joi.string(),
  location: Joi.object()
    .keys({
      lat: Joi.number(),
      long: Joi.number()
    })
    .required()
})

const update = Joi.object().keys({
  category: Joi.string(),
  type: Joi.string(),
  name: Joi.string(),
  thumbnail: Joi.string(),
  averageExpense: Joi.number(),
  openFrom: Joi.string(),
  openTo: Joi.string(),
  phone: Joi.string(),
  tags: Joi.array().items(Joi.string()),
  addressEn: Joi.string(),
  addressCn: Joi.string(),
  gallery: Joi.array().items(Joi.string()),
  keywords: Joi.string(),
  description: Joi.string(),
  descriptionCn: Joi.string(),
  province: Joi.string(),
  city: Joi.string(),
  district: Joi.string(),
  area: Joi.string(),
  street: Joi.string(),
  location: Joi.object().keys({
    lat: Joi.number(),
    long: Joi.number()
  })
})

module.exports = {
  create,
  update
}
