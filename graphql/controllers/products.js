const { Product } = require('../../models/Product')
const { mapMongooseErrors } = require('../../utils/formatErrors')
const cleanField = require('../../utils/cleanPaginationField')
const mongoose = require('mongoose')

const getById = async (data = {}) => {
  return new Promise(async(resolve, reject) => {
    let query = {}
    if (data.id) {
      query._id = data.id
    } else if (data._product) {
      query._id = data._product
    } else {
      reject(new Error('Erreur'))
    }
    const record = await Product.findOne(query)
    resolve(record)
  })
}

const getAll = async ({ page = 1, limit = 25} = {}) => {
  return new Promise(async(resolve, reject) => {
    if (limit > 25) {
      limit = 25
    }
    console.log('yeah, before')
    let data
    try {
      data = await Product.paginate({}, { page, limit })
    } catch(err) {
      console.log('err', err)
      reject(new Error('Erreur'))
    }
    resolve(cleanField(data))
  })
}

module.exports = {
  getById,
  getAll
}
