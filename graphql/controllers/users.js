const { User } = require('../../models/User')
const { Token } = require('../../models/Token')
const { Phone } = require('../../models/Phone')
const { mapMongooseErrors } = require('../../utils/formatErrors')
const cleanField = require('../../utils/cleanPaginationField')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { pick, assign } = require('lodash')

const loginWithPhoneAndPassword = (data = {}) => {
  return new Promise(async(resolve, reject) => {
    const { phone, password } = data

    let foundUser = await User.findOne({ phone })
    let token
    if (!foundUser) {
      reject(new Error('Unauthorized'))
    }
    const pswd = await bcrypt.hash(password, 10)
    const validPassword = await bcrypt.compare(password, foundUser.password)
    console.log('valid',validPassword, process.env.JWT_SECRET)
    if (!validPassword) {
      reject(new Error('Unauthorized'))
    }

    try {
      foundUser.firstLogin = false
      await foundUser.save()
      foundUser.loginAt = Date.now()
      token = await jwt.sign({ phone: foundUser.phone }, process.env.JWT_SECRET)
      await Token.create({ token, phone: foundUser.phone })
    } catch (error) {
      const { errMsg, errFields } = mapMongooseErrors(error)
      console.log(errFields, errMsg)
      reject(new Error(errMsg))
    }
    console.log(token)
    resolve(assign({user: foundUser}, { token }))
  })

}
const create = (data = {}) => {
  return new Promise(async (resolve, reject) => {
    data['createdAt'] = Date.now()
    data['updatedAt'] = Date.now()

    let foundPhone = await Phone.findOne({ phone: data.phone}).sort({ createdAt: -1 })
    if (!foundPhone) {
      reject(new Error('Veuillez Verifier votre numero de telephone'))
    }
    let foundUser = await User.findOne({ phone: data.phone})

    if (!foundUser) {
      reject(new Error('Numero de telephone deja utilise'))
    }

    data._verifiedPhone = foundPhone._id
    const salt = await bcrypt.genSalt(10)
    data.password = await bcrypt.hash(data.password, salt)
    let newUser
    let token

    try {
      newUser = await User.create(data)
      token = await jwt.sign({ phone: data.phone }, process.env.JWT_SECRET)
      await Token.create({ token, phone: data.phone })
    } catch (error) {
      const { errMsg, errFields } = mapMongooseErrors(error)
      console.log(errFields, errMsg)
      reject(new Error(errMsg))
    }
    resolve(assign(newUser, { token }))
  })
}

const update = (data = {}) => {
  return new Promise(async (resolve, reject) => {
    const data = req.body
    data['updatedAt'] = Date.now()
    let result
    try {
      result = await User.findOneAndUpdate({ phone: data.phone }, data, {
        new: true,
        upsert: true
      })
    } catch (error) {
      const { errMsg, errFields } = mapMongooseErrors(error)
      reject(errMsg)
    }
    resolve(result)
  })
}

const remove = async (req, res, next) => {
  const { id } = req.params
  let total
  try {
    const comment = await Comment.findOneAndRemove({ _id: id })
    let updatedItem = await mongoose
      .model(comment.itemType)
      .findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(comment.item) },
        { $pull: { comments: mongoose.Types.ObjectId(comment._id) } },
        { new: true, upsert: true }
      )
    let updatedArray = [...updatedItem.comments]
    total = updatedArray.length
    await mongoose
      .model(comment.itemType)
      .findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(comment.item) },
        { commentsCount: total },
        { upsert: true }
      )
  } catch (err) {
    return res.status(401).json({ success: false, err })
  }
  return res.status(200).json({ success: true, data: { total } })
}

const getById = (data = {}) => {
  return new Promise(async (resolve, reject) => {
    let query = {}
    if (data.phone) {
      query.phone = data.phone
    } else if (data.id) {
      query._id = data.id
    } else {
      reject(new Error('Erreur'))
    }
    const foundUser = await User.findOne(query)
    resolve(foundUser)
  })
}

const getAll = async ({ page = 1, limit = 25} = {}) => {
  return new Promise(async(resolve, reject) => {
    if (limit > 25) {
      limit = 25
    }
    const data = await User.paginate({}, { page, limit })
    resolve(cleanField(data))
  })
}

module.exports = {
  create,
  update,
  remove,
  getById,
  getAll,
  loginWithPhoneAndPassword
}
