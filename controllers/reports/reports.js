const { Report } = require('../../models')
const { mapMongooseErrors } = require('../../utils/formatErrors')

const create = async (req, res) => {
  const data = req.body
  let statusCode = 200
  try {
    let report = new Report(data)
    const result = await report.save()
    const success = result !== null

    res.status(200).json({
      message: 'Report successfully created',
      success,
      report: result
    })
  } catch (error) {
    statusCode = 401
    const { errMsg, errFields } = mapMongooseErrors(error)
    res.status(statusCode).json({ success: false, errMsg, errFields })
  }
}

const getById = async (req, res) => {
  const { id } = req.params
  const foundReport = await Report.findOne({ _id: id })
  if (foundReport) {
    res.status(200).json({
      success: true,
      report: foundReport
    })
  } else {
    res.status(401).json({
      success: false,
      errMsg: 'Report Not found'
    })
  }
}

const getAll = async (req, res) => {
  const { limit = 25, page = 1 } = req.params
  const results = await Report.paginate({}, { page, limit })
  if (results) {
    res.status(200).json({
      success: true,
      reports: results || []
    })
  }
}

const update = async (req, res) => {
  const { id } = req.params
  const data = req.body
  let statusCode = 200

  try {
    const updatedReports = await Report.findByIdAndUpdate({ _id: id }, data, { upsert: true })
    if (updatedReports) {
      res.status(statusCode).json({
        message: 'Reports successfully updated',
        success: true,
        reports: updatedReports
      })
    } else {
      res.status(401).json({
        success: false,
        errMsg: 'Reports Not found'
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
    const RemovedReport = await Report.findByIdAndRemove({ _id: id })
    if (RemovedReport) {
      res.status(statusCode).json({
        message: 'Report successfully removed',
        success: true
      })
    } else {
      res.status(401).json({
        success: false,
        errMsg: 'Report not found'
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
