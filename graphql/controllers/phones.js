const { Phone } = require('../../models/Phone')
const { mapMongooseErrors } = require('../../utils/formatErrors')
const cleanField = require('../../utils/cleanPaginationField')
const mongoose = require('mongoose')
const moment = require('moment')
const faker = require('faker')

const create = (data = {}) => {
  return new Promise(async (resolve, reject) => {
    data['createdAt'] = Date.now()
    data['updatedAt'] = Date.now()

    const startToday = moment().startOf('day')
    const countSMS = await Phone.countDocuments({phone: data.phone, createdAt: { $gt: startToday}})

    if (countSMS > 2) {
      reject(new Error('Le nombre d\'essaie par jour atteint, Veuillez reessayer prochainement'))
    }

    data.smsCode = faker.random.number({ min: 102030, max: 999999 })

    let foundPhone = await Phone.findOne({ phone: data.phone, verified: true })

    if (foundPhone) {
      reject(new Error('Le number de telephone a deja ete verifie'))
    }

    try {
      foundPhone = await Phone.create(data)
    } catch (error) {
      const { errMsg, errFields } = mapMongooseErrors(error)
      console.log(errFields, errMsg)
      reject(new Error(errMsg))
    }
    resolve(foundPhone)
  })
}

const getByPhone = async (data = {}) => {
  return new Promise(async(resolve, reject) => {
    let query = {}
    if (data.phone) {
      query.phone = data.phone
    } else if (data._province) {
      query._id = data._province
    } else {
      reject(new Error('Erreur'))
    }
    const record = await Phone.findOne(query)
    resolve(record)
  })
}

const getByPhoneCode = (phone) => {
  return Promise(async (resolve, reject) => {
    return await Phone.findOne({ phone })
  })
}

const getAll = async ({ page = 1, limit = 25} = {}) => {
  return new Promise(async(resolve, reject) => {
    if (limit > 25) {
      limit = 25
    }
    const data = await Phone.paginate({}, { page, limit })
    resolve(cleanField(data))
  })
}

module.exports = {
  getByPhone,
  getByPhoneCode,
  getAll,
  create
}
