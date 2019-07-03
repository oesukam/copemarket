const { Joi } = require('celebrate')

const create = Joi.object().keys({
  average: Joi.number(),
  barMenu: Joi.string(),
  title: Joi.string(),
  titleCn: Joi.string(),
  place: Joi.string().required(),
  category: Joi.string().required(),
  createdBy: Joi.string().required(),
  description: Joi.string(),
  discountRate: Joi.number(),
  endDate: Joi.number(),
  expireDate: Joi.number(),
  foodMenu: Joi.string(),
  originalPrice: Joi.number(),
  couponPrice: Joi.number(),
  startDate: Joi.number(),
  type: Joi.string(),
  period: Joi.string(),
  timeSection: Joi.string(),
  usesSection: Joi.boolean(),
  usesTime: [Joi.string(), Joi.array()],
  specialOffer: Joi.boolean(),
  specialOfferDesc: Joi.string(),
  usesSectionBar: Joi.boolean(),
  barOffer: Joi.string(),
  menuOffer: Joi.string(),
  thumbnail: Joi.string()
})

const update = Joi.object().keys({
  average: Joi.number(),
  barMenu: Joi.string(),
  place: Joi.string().required(),
  category: Joi.string().required(),
  createdBy: Joi.string().required(),
  description: Joi.string(),
  discountRate: Joi.number(),
  endDate: Joi.number(),
  expireDate: Joi.number(),
  foodMenu: Joi.string(),
  originalPrice: Joi.number(),
  couponPrice: Joi.number(),
  startDate: Joi.number(),
  type: Joi.string(),
  title: Joi.string(),
  titleCn: Joi.string(),
  period: Joi.string(),
  timeSection: Joi.string(),
  usesSection: Joi.boolean(),
  usesTime: [Joi.string(), Joi.array()],
  specialOffer: Joi.boolean(),
  specialOfferDesc: Joi.string(),
  usesSectionBar: Joi.boolean(),
  barOffer: Joi.string(),
  menuOffer: Joi.string(),
  thumbnail: Joi.string()
})

const purchase = Joi.object().keys({
  openId: Joi.string().required(),
  tradeNumber: Joi.string().required(),
  totalFee: Joi.number().required(),
  user: Joi.string().required(),
  purchased_coupon: Joi.string()
})

const activate = Joi.object().keys({
  user: Joi.string().required(),
  form_id: Joi.string().required(),
  page: Joi.string().required(),
  purchased_coupon: Joi.string()
})

module.exports = {
  create,
  update,
  purchase,
  activate
}
