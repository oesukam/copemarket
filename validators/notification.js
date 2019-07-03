const { Joi } = require('celebrate')

const create = Joi.object().keys({
  user: Joi.string().required(),
  item: Joi.string().required(),
  itemType: Joi.string().required(),
  message: Joi.string().required(),
  action: Joi.string().required(),
  platform: Joi.string().required()
})

const update = Joi.object().keys({
	read: Joi.boolean()
})

module.exports = {
  create,
  update
}
