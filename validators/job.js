const { Joi } = require('celebrate')

const create = Joi.object().keys({
  categoryId: Joi.string().required(),
  logo: Joi.string(),
  name: Joi.string().required(),
  nameCn: Joi.string(),
  CompanyDescription: Joi.string().required(),
  CompanyDescriptionCn: Joi.string(),
  addressEn: Joi.string().required(),
  addressCn: Joi.string(),
  area: Joi.string(),
  location: Joi.object().keys({
    long: Joi.number(),
    lat: Joi.number()
  }),
  titleEn: Joi.string().required(),
  titleCn: Joi.string(),
  JobDescriptionEn: Joi.string().required(),
  JobDescriptionCn: Joi.string(),
  requirements: Joi.string(),
  negotiableSalary: Joi.boolean(),
  salaryFrom: Joi.number().min(0),
  salaryTo: Joi.number().min(0),
  activityType: Joi.string(),
  tags: Joi.array()
    .items(Joi.string())
    .required(),
  startTime: Joi.date(),
  endTime: Joi.date(),
  contactEmail: Joi.string(),
  conctactWechat: Joi.string().required(),
  conctactPhone: Joi.string().required()
})

module.exports = {
  create
}
