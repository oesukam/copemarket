const { Joi } = require('celebrate')

const create = Joi.object().keys({
  userId: Joi.string().required(),
  message : Joi.string().required(),

})

module.exports = {
  create
}
