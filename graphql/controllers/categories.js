const { Category } = require('../../models/Category')
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
    const record = await Category.findOne(query)
    resolve(record)
  })
}

const getAll = async ({ page = 1, limit = 25} = {}) => {
  return new Promise(async(resolve, reject) => {
    if (limit > 25) {
      limit = 25
    }
    const data = await Category.paginate({}, { page, limit })
    resolve(cleanField(data))
  })
}

const getAllList = async () => {
  return new Promise(async(resolve, reject) => {
    let query = {}
    query._parent = null
    // query._parent = { $or: [ { $exists: false }, { $eq: null }] }
    const results = await Category.aggregate([
      {
        $match: query
      },
      {
        $project: {
          _id: 1,
          name: 1,
          _parent: 1,
          type: 1,
          icon: 1,
          poster: 1,
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_parent',
          as: 'sub'
        }
      },
      {
        $unwind: '$sub'
      },
      {
        $group: {
          _id: '$_id',
          name: { '$first': '$name'},
          type: { '$first': '$type'},
          poster: { '$first': '$poster'},
          icon: { '$first': '$icon'},
          subs: {
            $push: {
              '_id': '$sub._id',
              'name': '$sub.name',
              'type': '$sub.type',
              'poster': '$sub.poster',
              'icon': '$sub.icon',
              '_parent': '$sub._parent',
            }
          }
        },
      },
    ])
    resolve(results)
  })
}

module.exports = {
  getById,
  getAll,
  getAllList
}
