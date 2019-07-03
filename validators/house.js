const { Joi } = require('celebrate')

const create = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().required(),
  descriptionCn: Joi.string().required(),
  nearestMetroStation: Joi.string(),
  nearestLandMark: Joi.string(),
  transactionType: Joi.string().required(),
  ownershipType: Joi.string().required(),
  price: Joi.number()
    .required()
    .min(0),
  addressEn: Joi.string().required(),
  addressCn: Joi.string().required(),
  area: Joi.string().required(),
  location: Joi.object()
    .keys({
      long: Joi.number(),
      lat: Joi.number()
    })
    .required(),
  amenties: Joi.array().items(Joi.string()),
  bedrooms: Joi.number().required(),
  toilets: Joi.number().required(),
  bathrooms: Joi.number().required(),
  furniture: Joi.number().required(),
  otherRooms: Joi.number(),
  internet: Joi.string(),
  petsPolicy: Joi.string().required(),
  gallery: Joi.array().items(Joi.string()),
  thumbnail: Joi.string().required(),
  contactPhone: Joi.string().required(),
  contactEmail: Joi.string(),
  contactWechat: Joi.string(),
  available: Joi.boolean()
})

module.exports = {
  create
}
