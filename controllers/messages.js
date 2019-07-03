const { Message } = require('../../models')
const { mapMongooseErrors } = require('../../utils/formatErrors')

const create = async (req, res, next) => {
  const data = req.body.message
  let newMessage
  try {
    newMessage = await Message.create(data)
  } catch (error) {
    const { errMsg, errFields } = mapMongooseErrors(error)
    return res.status(401).json({ success: false, errMsg, errFields })
  }
  res.status(200).json({ success: true, data: newMessage })
}

const getById = async (req, res) => {
  const { id } = req.params
  const foundMessage = await Message.findOne({ _id: id })
  if (foundMessage) {
    res.status(200).json({
      success: true,
      message: foundMessage
    })
  } else {
    res.status(401).json({
      success: false,
      errMsg: 'Message Not found'
    })
  }
}

const getAll = async (req, res) => {
  const { limit = 25, page = 1 } = req.params
  const results = await Message.paginate({}, { page, limit })
  if (results) {
    res.status(200).json({
      success: true,
      messages: results || []
    })
  }
}

const update = async (req, res) => {
  const { id } = req.params
  const data = req.body
  let updatedMessage
  try {
    updatedMessage = await Message.findByIdAndUpdate({ _id: id }, data, { upsert: true })
  } catch (error) {
    statusCode = 401
    const { errMsg, errFields } = mapMongooseErrors(error)
    return res.status(statusCode).json({ success: false, errMsg, errFields })
  }
  res.status(200).json({
    success: true,
    data: updatedMessage
  })
}

const remove = async (req, res) => {
  const { id } = req.params
  let statusCode = 200

  try {
    const RemovedMessage = await Message.findByIdAndRemove({ _id: id })
    if (RemovedMessage) {
      res.status(statusCode).json({
        message: 'Message successfully removed',
        success: true
      })
    } else {
      res.status(401).json({
        success: false,
        errMsg: 'Message not found'
      })
    }
  } catch (error) {
    statusCode = 401
    const { errMsg, errFields } = mapMongooseErrors(error)
    res.status(statusCode).json({ success: false, errMsg, errFields })
  }
}

module.exports = {
  create,
  getById,
  getAll,
  update,
  remove
}
