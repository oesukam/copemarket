const { Joi } = require('celebrate')

const create = Joi.object().keys({
  message: Joi.object()
    .keys({
      user: Joi.string().required(),
      text: Joi.string().required()
    })
    .required(),
  image: Joi.string(),
  topic: Joi.string().required(),
  users: Joi.array().items(Joi.string().required(), Joi.string().required()),
  item: Joi.string().required(),
  itemType: Joi.string().required(),
  currentUser: Joi.object()
})

module.exports = {
  create
}
