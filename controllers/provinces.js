const { CitySchema, GraphQLSchema } = require('../models')
const all = require('../models')
const { mapMongooseErrors } = require('../utils/formatErrors')
const mongoose = require('mongoose')

const create = async (data = {}) => {
  data['createdAt'] = Date.now()
  data['updatedAt'] = Date.now()
  let city
  try {
    city = await CitySchema.create(data)
    return city
  } catch (error) {
    const { errMsg, errFields } = mapMongooseErrors(error)
    return { success: false, errMsg, errFields }
  }
  return city
}

const getById = async (id) => {
  console.log(CitySchema, 'ppp', all, GraphQLSchema)
  const result = await CitySchema.findOne({ _id: id })
  if (!result) {
    return {
      success: false,
      errMsg: 'Not found'
    }
  }
  return {
    success: true,
    data: result
  }

}

const getAll = async () => {
  const results = await CitySchema.find({})
  if (!results) {
    return {
      success: false,
      cities: []
    }
  }
  return {
    success: true,
    cities: results || []
  }
}

const index = async (req, res) => {
  let { item = null, itemType = null, user = null, page = 1, limit = 25 } = req.query
  page = parseInt(page)
  limit = parseInt(limit)
  let query = {}

  if (item) {
    query['item'] = item
  }

  if (itemType) {
    query['itemType'] = itemType
  }

  if (user) {
    query['user'] = user
  }

  const comments = await Comment.paginate(query, {
    sort: { createdAt: -1 },
    page,
    limit,
    populate: { path: 'user', select: '_id avatar firstName lastName' }
  })

  res.status(200).json({
    success: true,
    data: comments || []
  })
}

const update = async (req, res) => {
  const { id } = req.params
  const data = req.body
  data['updatedAt'] = Date.now()
  try {
    const result = await Comment.findOneAndUpdate({ _id: id }, data, {
      new: true,
      upsert: true
    })
    return res.status(200).json({
      success: true,
      data: result
    })
  } catch (error) {
    const { errMsg, errFields } = mapMongooseErrors(error)
    return res.status(401).json({ success: false, errMsg, errFields })
  }
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

module.exports = {
  create,
  getById,
  getAll,
  update,
  remove,
  index
}
