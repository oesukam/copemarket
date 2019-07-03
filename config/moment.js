let moment = require('moment')
const fr = require('./moment_fr')
moment.locale('fr', fr)
moment.locale('fr')

module.exports = moment
