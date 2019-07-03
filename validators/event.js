const { Joi } = require('celebrate')

const create = Joi.object().keys({
  title: Joi.string().required(),
  titleCn: Joi.string(),
  author: Joi.string().required(),
  phone: Joi.string().required(),
  description: Joi.string().required(),
  descriptionCn: Joi.string().required(),
  eventFrequency: Joi.string().required(),
  startDate: Joi.number()
    .integer()
    .required(),
  endDate: Joi.number()
    .integer()
    .required(),
  days: Joi.array()
    .items(Joi.string()),
  startAt: Joi.string().required(),
  endAt: Joi.string().required(),
  thumbnail: Joi.string(),
  gallery: Joi.array()
    .items(Joi.string()),
  specialOffers: Joi.string(),
  category: Joi.string().required(),
  place: Joi.string().required(),
  keywords: Joi.string()
})

const update = Joi.object().keys({
  title: Joi.string(),
  titleCn: Joi.string(),
  phone: Joi.string(),
  description: Joi.string(),
  descriptionCn: Joi.string(),
  eventFrequency: Joi.string(),
  startDate: Joi.number().integer(),
  endDate: Joi.number().integer(),
  days: Joi.array().items(Joi.string()),
  startAt: Joi.string(),
  endAt: Joi.string(),
  thumbnail: Joi.string(),
  gallery: Joi.array().items(Joi.string()),
  specialOffers: Joi.string(),
  category: Joi.string(),
  place: Joi.string(),
  author: Joi.string(),
  keywords: Joi.string()
})

const updateStatus = Joi.object().keys({
  key: Joi.string().required(),
  value: Joi.string().required()
})

module.exports = {
  create,
  update,
  updateStatus
}
