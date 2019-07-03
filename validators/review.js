const { Joi } = require('celebrate')

const create = Joi.object().keys({
  user: Joi.string().required(),
  item: Joi.string().required(),
  itemType: Joi.string().required(),
  text : Joi.string().required(),
  rate : Joi.number().min(0),
  gallery: Joi.array().items(Joi.string()), 
  currentUser : Joi.object()
})

const update = Joi.object().keys({
  text: Joi.string().required(),
  gallery: Joi.array().items(Joi.string()),
  rate : Joi.number().min(0)
})

module.exports = {
  create, 
  update
}
