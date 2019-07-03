const { Province } = require('../../models/Province')
const { mapMongooseErrors } = require('../../utils/formatErrors')
const cleanField = require('../../utils/cleanPaginationField')
const mongoose = require('mongoose')

const getById = async (data = {}) => {
  return new Promise(async(resolve, reject) => {
    let query = {}
    if (data.id) {
      query._id = data.id
    } else if (data._province) {
      query._id = data._province
    } else {
      reject(new Error('Erreur'))
    }
    const record = await Province.findOne(query)
    resolve(record)
  })
}

const getAll = async ({ page = 1, limit = 25} = {}) => {
  return new Promise(async(resolve, reject) => {
    if (limit > 25) {
      limit = 25
    }
    const data = await Province.paginate({}, { page, limit })
    resolve(cleanField(data))
  })
}

module.exports = {
  getById,
  getAll
}
