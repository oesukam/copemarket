const { Review } = require('../../models')
const { mapMongooseErrors } = require('../../utils/formatErrors')
const mongoose = require('mongoose')

const create = async (req, res, next) => {
  const data = req.body
  data['createdAt'] = Date.now()
  data['updatedAt'] = Date.now()
  let review
  let total
  try {
    review = await Review.create(data)
    let updatedItem = await mongoose
      .model(review.itemType)
      .findOneAndUpdate(
        { _id: review.item },
        { $push: { reviews: review._id } },
        { new: true, upsert: true }
      )
    let updatedArray = [...updatedItem.reviews]
    total = updatedArray.length
    await mongoose
      .model(review.itemType)
      .findOneAndUpdate({ _id: review.item }, { reviewsCount: total }, { upsert: true })
  } catch (error) {
    const { errMsg, errFields } = mapMongooseErrors(error)
    return res.status(401).json({ success: false, errMsg, errFields })
  }
  return res.status(200).json({ success: true, data: { review, total } })
}

const show = async (req, res) => {
  const { id } = req.params
  const foundReview = await Review.findOne({ _id: id })
  if (foundReview) {
    res.status(200).json({
      success: true,
      review: foundReview
    })
  } else {
    res.status(401).json({
      success: false,
      errMsg: 'Review Not found'
    })
  }
}

const index = async (req, res) => {
  let { item = null, itemType = null, user = null, limit = 25, page = 1 } = req.query
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

  const results = await Review.paginate(query, {
    sort: { createdAt: 'desc' },
    page,
    limit,
    populate: { path: 'user', select: '_id avatar firstName lastName wechatName' }
  })
  if (results) {
    res.status(200).json({
      success: true,
      reviews: results || []
    })
  }
}

const update = async (req, res) => {
  const { id } = req.params
  const data = req.body
  data['updatedAt'] = Date.now()
  try {
    const updatedReview = await Review.findByIdAndUpdate({ _id: id }, data, { upsert: true })
    if (updatedReview) {
      return res.status(200).json({
        success: true,
        message: 'Review successfully updated'
      })
    } else {
      res.status(401).json({
        success: false,
        errMsg: 'Review Not found'
      })
    }
  } catch (error) {
    const { errMsg, errFields } = mapMongooseErrors(error)
    res.status(401).json({ success: false, errMsg, errFields })
  }
}

const remove = async (req, res) => {
  const { id } = req.params
  let total
  try {
    const RemovedReview = await Review.findByIdAndRemove({ _id: id })
    let updatedItem = await mongoose
      .model(RemovedReview.itemType)
      .findOneAndUpdate(
        { _id: RemovedReview.item },
        { $pull: { reviews: RemovedReview._id } },
        { new: true, upsert: true }
      )
    let updatedArray = [...updatedItem.reviews]
    total = updatedArray.length
    await mongoose
      .model(RemovedReview.itemType)
      .findOneAndUpdate(
        { _id: RemovedReview.item },
        { reviewsCount: total },
        { new: true, upsert: true }
      )
  } catch (error) {
    const { errMsg, errFields } = mapMongooseErrors(error)
    return res.status(401).json({ success: false, errMsg, errFields })
  }

  return res.status(200).json({
    success: true,
    data: { total }
  })
}

module.exports = {
  create,
  show,
  index,
  update,
  remove
}
