const mongoose = require('mongoose')
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/copemarket', { useNewUrlParser: true })
// mongoose.connect('mongodb://localhost/zwatek')

module.exports = mongoose
