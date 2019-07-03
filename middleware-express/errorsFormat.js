const { isCelebrate } = require('celebrate')
const { mapJoiErrors } = require('../utils/formatErrors')

const joiErrors = () => {
  return (err, req, res, next) => {
    const lang = req.headers['accept-language'] || 'en'
    if (isCelebrate(err)) {
      var errFields = null
      console.log(err)
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

module.exports = {
  joiErrors
}
