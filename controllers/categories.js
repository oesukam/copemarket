const mongoose = require('mongoose')

const { Category } = require('../../models')
const { mapMongooseErrors } = require('../../utils/formatErrors')

const create = async (req, res) => {
  const data = req.body
  data['createdAt'] = Date.now()
  data['updatedAt'] = Date.now()
  let statusCode = 200
  try {
    let model = new Category(data)
    const newCategory = await model.save()
    const success = newCategory !== null
    res.status(200).json({
      message: 'Category successfully created',
      success,
      data: newCategory
    })
  } catch (error) {
    statusCode = 401
    const { errMsg, errFields } = mapMongooseErrors(error)
    res.status(statusCode).json({ success: false, errMsg, errFields })
  }
}

const show = async (req, res) => {
  const { id } = req.params
  if (mongoose.Types.ObjectId.isValid(id)) {
    const result = await Category.findOne({ _id: id })
    if (result) {
      res.status(200).json({
        success: true,
        category: result
      })
    } else {
      res.status(401).json({
        success: false,
        errMsg: 'Not found'
      })
    }
  } else {
    res.status(401).json({
      success: false,
      errMsg: 'Category ID is not valid'
    })
  }
}

const index = async (req, res) => {
  const { filter } = req.query
  const results = await Category.find({ type: filter }).sort({ order: 1 })
  // let query = {}
  // if(filter) {
  //   query['type'] = filter
  //   query.parent = { $exists: false }
  // }
  // const results = await Category.aggregate([
  //   {
  //     $match: query
  //   },
  //   {
  //     $project: {
  //       _id: 1,
  //       name: 1,
  //       nameCn: 1,
  //       type: 1,
  //       icon: 1,
  //       thumbnail: 1,
  //     },
  //   },
  //   {
  //     $lookup: {
  //       from: 'categories',
  //       localField: '_id',
  //       foreignField: 'parent',
  //       as: 'sub'
  //     }
  //   },
  //   {
  //     $unwind: '$sub'
  //   },
  //   {
  //     $group: {
  //       _id: '$_id',
  //       name: { '$first': '$name'},
  //       nameCn: { '$first': '$nameCn'},
  //       type: { '$first': '$type'},
  //       thumbnail: { '$first': '$thumbnail'},
  //       icon: { '$first': '$icon'},
  //       subs: {
  //         $push: {
  //           '_id': '$sub._id',
  //           'name': '$sub.name',
  //           'nameCn': '$sub.nameCn',
  //           'type': '$sub.type',
  //           'thumbnail': '$sub.thumbnail',
  //           'icon': '$sub.icon',
  //           'parent': '$sub.parent',
  //         }
  //       }
  //     },
  //   },
  // ])
  if (results) {
    res.status(200).json({
      success: true,
      data: results || []
    })
  }
}

const update = async (req, res) => {
  const { id } = req.params
  let resp
  const data = req.body
  data['updatedAt'] = Date.now()
  try {
    resp = await Category.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, data, {
      new: true,
      upsert: true
    })
  } catch (error) {
    const { errMsg, errFields } = mapMongooseErrors(error)
    res.status(401).json({ success: false, errMsg, errFields })
  }
  res.status(200).json({
    success: true,
    data: resp
  })
}

const remove = async (req, res) => {
  const { id } = req.params
  const result = await Category.remove({ _id: id })
  if (result) {
    res.status(200).json({
      success: true,
      message: 'Category successfully deleted'
    })
  } else {
    res.status(401).json({
      success: false,
      errMsg: 'Not found'
    })
  }
}

/* const filterBy = async (req,res) =>{
  const {filter, page=1, limit=25} = req.query
  console.log(filter)
  const results = await Category.paginate({type:filter},{
    page,
    limit
  })

  res.status(200).json({ success: true, results })

} */

module.exports = {
  create,
  show,
  index,
  update,
  remove
}
