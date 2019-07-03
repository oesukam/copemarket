const { Product } = require('../../models')
const { mapMongooseErrors } = require('../../utils/formatErrors')

const create = async (req, res) => {
  const data = req.body
  let statusCode = 200
  try {
    let product = new Product(data)
    const result = await product.save()
    const success = result !== null

    res.status(200).json({
      message: 'Item successfully created',
      success,
      product: result
    })
  } catch (error) {
    statusCode = 401
    const { errMsg, errFields } = mapMongooseErrors(error)
    res.status(statusCode).json({ success: false, errMsg, errFields })
  }
}

const getById = async (req, res) => {
  const { id } = req.params
  const foundItem = await Item.findOne({ _id: id })
  if (foundItem) {
    res.status(200).json({
      success: true,
      product: foundItem
    })
  } else {
    res.status(401).json({
      success: false,
      errMsg: 'Item Not found'
    })
  }
}

const getAll = async (req, res) => {
  const { limit = 25, page = 1 } = req.params
  const results = await Item.paginate({}, { page, limit })
  if (results) {
    res.status(200).json({
      success: true,
      products: results || []
    })
  }
}

const update = async (req, res) => {
  const { id } = req.params
  const data = req.body
  let statusCode = 200

  try {
    const updatedItem = await Item.findByIdAndUpdate({ _id: id }, data, { upsert: true })
    if (updatedItem) {
      res.status(statusCode).json({
        message: 'Item successfully updated',
        success: true,
        item: updatedItem
      })
    } else {
      res.status(401).json({
        success: false,
        errMsg: 'Item Not found'
      })
    }
  } catch (error) {
    statusCode = 401
    const { errMsg, errFields } = mapMongooseErrors(error)
    res.status(statusCode).json({ success: false, errMsg, errFields })
  }
}

const remove = async (req, res) => {
  const { id } = req.params
  let statusCode = 200

  try {
    const RemovedItem = await Item.findByIdAndRemove({ _id: id })
    if (RemovedItem) {
      res.status(statusCode).json({
        message: 'Item successfully removed',
        success: true
      })
    } else {
      res.status(401).json({
        success: false,
        errMsg: 'Item not found'
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
