const { Conversation, Message } = require('../../models')
const { mapMongooseErrors } = require('../../utils/formatErrors')
const mongoose = require('mongoose')

const create = async (req, res) => {
  const data = req.body
  let conversation
  try {
    const newConversation = await Conversation.create({
      messages: [],
      users: data.users,
      participants: data.users,
      image: data.image,
      topic: data.topic,
      itemType: data.itemType,
      item: data.itemId
    })

    const newMessage = await Message.create({
      conversation: newConversation._id,
      user: data.message.user,
      text: data.message.text
    })

    conversation = await Conversation.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(newConversation._id) },
      { $push: { messages: newMessage._id } },
      { new: true, upsert: true }
    )
  } catch (error) {
    const { errMsg, errFields } = mapMongooseErrors(error)
    return res.status(401).json({ success: false, errMsg, errFields })
  }
  res.status(200).json({
    success: true,
    data: conversation
  })
}

const update = async (req, res) => {
  const { id } = req.params
  const data = req.body
  let updatedConversation
  try {
    const newMessage = await Message.create({ ...data, conversation: mongoose.Types.ObjectId(id) })
    updatedConversation = await Conversation.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(id) },
      { $push: { messages: newMessage._id } },
      { new: true, upsert: true }
    )
  } catch (error) {
    const { errMsg, errFields } = mapMongooseErrors(error)
    return res.status(401).json({ success: false, errMsg, errFields })
  }
  res.status(200).json({ success: true, data: updatedConversation })
}

const show = async (req, res) => {
  const { id } = req.params
  const { page = 1, limit = 25 } = req.query
  const conversation = await Conversation.findOne({ _id: mongoose.Types.ObjectId(id) })
    .select({ messages: 0, updatedAt: 0, users: 0, participants: 0 })
    .populate({ path: 'item', select: '_id name nameCn title titleCn' })
  const messages = await Message.paginate(
    { conversation: mongoose.Types.ObjectId(id) },
    {
      select: '_id conversation user text cretedAt',
      populate: { path: 'user', select: '_id avatar firstName lastName' },
      page,
      limit
    }
  )
  res.status(200).json({
    success: true,
    data: {
      conversation,
      messages
    }
  })
}

const getAll = async (req, res) => {
  const { limit = 25, page = 1 } = req.params
  const results = await Conversation.paginate({}, { page, limit })
  if (results) {
    res.status(200).json({
      success: true,
      conversations: results || []
    })
  }
}

const remove = async (req, res) => {
  const { id } = req.params
  let statusCode = 200

  try {
    const RemovedConversation = await Conversation.findByIdAndRemove({ _id: id })
    if (RemovedConversation) {
      res.status(statusCode).json({
        message: 'Conversation successfully removed',
        success: true
      })
    } else {
      res.status(401).json({
        success: false,
        errMsg: 'Conversation not found'
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
  show,
  getAll,
  update,
  remove
}
