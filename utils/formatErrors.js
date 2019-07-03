var validationsCn = require('../mocks/validations.mock.en')
var validationsEn = require('../mocks/validations.mock.en')
var fieldsCn = require('../mocks/schemaFields.mock.en')
var fieldsEn = require('../mocks/schemaFields.mock.en')
const { isCelebrate } = require('celebrate')


exports.mapMongooseErrors = (error, lang = 'en') => {
  const errors = error.errors
  let newErrors = {}
  let errMsg = ''
  for (let key in errors) {
    var value = errors[key]
    if (value) {
      var newError =
        lang === 'cn' ? validationsCn[value.kind] || '' : validationsEn[value.kind] || value.kind
      var newKey = lang === 'cn' ? fieldsCn[key] || '' : fieldsEn[key] || key
      if (newError) {
        newErrors[key] = newError.replace(/\{\{attribute\}\}/, newKey)
      }
    }
  }
  if (error.code === 11000) {
    errMsg = 'Existe deja'
  } else if (error.name === 'ValidationError') {
    errMsg = 'Vueillez remplir tout les champs '
  } else {
    errMsg = 'Erreur, veuillez reessayer'
  }
  return { errMsg, errFields: newErrors }
}

const mapJoiErrors = (errors, lang = 'en') => {
  var newErrors = {}
  for (let index in errors) {
    var value = errors[index]
    if (value) {
      var type = value.type.replace(/(\.base|any\.)/, '')
      if (validationsEn[type]) {
        var key = value.context.key
        var newError = lang === 'cn' ? validationsCn[type] || '' : validationsEn[type] || type
        var newKey = lang === 'cn' ? fieldsCn[key] || '' : fieldsEn[key] || key
        if (newError) {
          if (value.context.limit) {
            newError = newError.replace(/\{\{min\}\}/, value.context.limit)
          }
          newErrors[key] = newError.replace(/\{\{attribute\}\}/, newKey)
        }
      }
    }
  }
  return newErrors
}


exports.joiErrors = () => {
  return (err, req, res, next) => {
    const lang = req.headers['accept-language'] || 'en'
    if (isCelebrate(err)) {
      var errFields = null
      if (err.details) {
        errFields = mapJoiErrors(err.details, lang)
      }
      const data = {
        success: false,
        errMsg: 'Bad Request',
        errFields
      }
      return res.status(400).json(data)
    }
    // If this isn't a Joi error, send it to the next error handler
    return next(err)
  }
}

