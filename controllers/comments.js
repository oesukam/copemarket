const { Comment } = require('../../models')
const { mapMongooseErrors } = require('../../utils/formatErrors')
const mongoose = require('mongoose')

const create = async (req, res, next) => {
  let data = req.body
  data['createdAt'] = Date.now()
  data['updatedAt'] = Date.now()
  let resp
  let total
  try {
    let comment = await Comment.create(data)
    let updatedItem = await mongoose
      .model(comment.itemType)
      .findOneAndUpdate(
        { _id: comment.item },
        { $push: { comments: comment._id } },
        { new: true, upsert: true }
      )
    let updatedArray = [...updatedItem.comments]
    total = updatedArray.length
    await mongoose
      .model(comment.itemType)
      .findOneAndUpdate({ _id: comment.item }, { commentsCount: total }, { upsert: true })
    resp = await Comment.populate(comment, {
      path: 'user',
      select: '_id avatar firstName lastName wechatName'
    })
  } catch (error) {
    const { errMsg, errFields } = mapMongooseErrors(error)
    return res.status(401).json({ success: false, errMsg, errFields })
  }
  return res.status(200).json({ success: true, data: { comment: resp, total } })
}

const getById = async (req, res) => {
  const { id } = req.params
  const result = await Comment.findOne({ _id: id })
  if (result) {
    res.status(200).json({
      success: true,
      data: result
    })
  } else {
    res.status(401).json({
      success: false,
      errMsg: 'Not found'
    })
  }
}

const getAll = async (req, res) => {
  const results = await Comment.find({})
  if (results) {
    res.status(200).json({
      success: true,
      comments: results || []
    })
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
