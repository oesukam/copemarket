const { Joi } = require('celebrate')

const create = Joi.object().keys({
  name: Joi.string().required(),
  nameCn: Joi.string().required(),
  type: Joi.string().required(),
  icon: Joi.string(),
  description: Joi.string(),
  descriptionCn: Joi.string(),
  thumbnail: Joi.string().required(),
  parent: Joi.string()
})



module.exports = {
  create
}
