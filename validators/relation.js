const { Joi } = require('celebrate')

const create = Joi.object().keys({
  item: Joi.string().required(),
  user: Joi.string().required(),
  itemType: Joi.string().required(),
  action: Joi.string().required(),
  currentUser: Joi.object()
})

module.exports = {
  create
}
