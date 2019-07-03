const { Joi } = require('celebrate')

const create = Joi.object().keys({
  user: Joi.string().required(),
  text: Joi.string().required(),
  currentUser: Joi.object()
})

const update = Joi.object().keys({
  text: Joi.string(),
  currentUser: Joi.object()
})

module.exports = {
  create
}
