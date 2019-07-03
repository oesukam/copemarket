const { City } = require('../../models/City')
const { mapMongooseErrors } = require('../../utils/formatErrors')
const cleanField = require('../../utils/cleanPaginationField')
const mongoose = require('mongoose')

const getById = async (data = {}) => {
  return new Promise(async(resolve, reject) => {
    let query = {}
    if (data.id) {
      query._id = data.id
    } else if (data._city) {
      query._id = data._city
    } else {
      reject(new Error('Erreur'))
    }
    const record = await City.findOne(query)
    resolve(record)
  })
}

const getAll = async ({ page = 1, limit = 25} = {}) => {
  return new Promise(async(resolve, reject) => {
    if (limit > 25) {
      limit = 25
    }
    const data = await City.paginate({}, { page, limit })
    resolve(cleanField(data))
  })

}

module.exports = {
  getById,
  getAll
}
