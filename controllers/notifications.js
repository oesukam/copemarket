const { Notification } = require('../../models')
const { mapMongooseErrors } = require('../../utils/formatErrors')
const mongoose = require('mongoose')
const moment = require('moment')

const create = async (req, res) => {
  const data = req.body
  let notification
  try {
    if (data.action !== 'delete') {
      const foundItem = await mongoose
        .model(data.itemType)
        .findOne({ _id: mongoose.Types.ObjectId(data.item) })

      if (!foundItem) {
        return res.status(401).json({ success: false, errMsg: 'Item was not found' })
      }

      if (foundItem.approvedBy) {
        data['receiver'] = foundItem.approvedBy
      }
    }

    notification = await Notification.create(data)
  } catch (error) {
    const { errMsg, errFields } = mapMongooseErrors(error)
    return res.status(401).json({ success: false, errMsg, errFields })
  }
  res.status(200).json({
    success: true,
    data: {
      notification
    }
  })
}

const show = async (req, res) => {
  const { id } = req.params
  const foundNotification = await Notification.findOne({ _id: id })
  if (foundNotification) {
    res.status(200).json({
      success: true,
      notification: foundNotification
    })
  } else {
    res.status(401).json({
      success: false,
      errMsg: 'Notification Not found'
    })
  }
}

const index = async (req, res) => {
  let {
    type = null,
    archive = false,
    read = null,
    myListing = null,
    limit = 25,
    page = 1
  } = req.query
  limit = parseInt(limit)
  page = parseInt(page)
  let query = {}
  if (type) {
    query['itemType'] = type
  }
  if (myListing) {
    query['receiver'] = mongoose.Types.ObjectId(myListing)
  } else {
    query['receiver'] = { $exists: false }
  }
  const currentDateStart = moment().startOf('day')
  const currentDateEnd = moment().endOf('day')
  if (archive) {
    query['createdAt'] = { $lt: currentDateStart._d }
  } else {
    query['createdAt'] = { $gte: currentDateStart._d, $lte: currentDateEnd._d }
  }
  if (read) {
    query['read'] = read
  }
  const results = await Notification.paginate(query, { sort: { createdAt: -1 }, page, limit })
  res.status(200).json({
    success: true,
    data: results || []
  })
}

const update = async (req, res) => {
  const { id } = req.params
  const data = req.body
  let updatedNotification

  try {
    updatedNotification = await Notification.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(id) },
      data,
      { new: true, upsert: true }
    )
  } catch (error) {
    const { errMsg, errFields } = mapMongooseErrors(error)
    return res.status(401).json({ success: false, errMsg, errFields })
  }

  res.status(200).json({
    success: true,
    data: updatedNotification
  })
}

const remove = async (req, res) => {
  const { id } = req.params
  try {
    await Notification.findByIdAndRemove({ _id: id })
  } catch (error) {
    const { errMsg, errFields } = mapMongooseErrors(error)
    res.status(401).json({ success: false, errMsg, errFields })
  }
  res.status(200).json({
    success: true
  })
}

module.exports = {
  create,
  show,
  index,
  update,
  remove
}
