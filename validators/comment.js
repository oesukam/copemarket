const { Joi } = require('celebrate')

const create = Joi.object().keys({
  item: Joi.string().required(),
  user: Joi.string().required(),
  itemType: Joi.string().required(),
  text: Joi.string().required(),
  currentUser: Joi.object()
})

const update = Joi.object().keys({
  text: Joi.string().required()
})

module.exports = {
  create,
  update
}
