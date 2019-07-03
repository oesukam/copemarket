const { Relation, User, Coupon } = require('../../models')
const mongoose = require('mongoose')
const { mapMongooseErrors } = require('../../utils/formatErrors')

const create = async (req, res) => {
  const { user, itemType, item, action } = req.body

  const foundAction = await mongoose.model(itemType).findOne({
    _id: mongoose.Types.ObjectId(item),
    [action]: { $in: [mongoose.Types.ObjectId(user)] }
  })

  if (foundAction && (action === 'follows' || action === 'likes') ) {
    return res.status(401).json({ success: false, errMsg: 'This relation already exist' })
  }

  let resp
  try {
    let updatedAction
    if (action === 'follows' || action === 'likes') {
      updatedAction = await mongoose
        .model(itemType)
        .findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(item) },
          { $addToSet: { [action]: mongoose.Types.ObjectId(user) } },
          { new: true, upsert: true }
        )
    } else {
      updatedAction = await mongoose
        .model(itemType)
        .findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(item) },
          { $push: { [action]: mongoose.Types.ObjectId(user) } },
          { new: true, upsert: true }
        )
    }
    await Relation.create(req.body)
    const updatedArray = [...updatedAction[action]]
    resp = await mongoose
      .model(itemType)
      .findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(item) },
        { [`${action}Count`]: updatedArray.length },
        { new: true, upsert: true }
      )
  } catch (err) {
    console.log('err', err)
    const { errMsg, errFields } = mapMongooseErrors(err)
    return res.status(401).json({ success: false, errMsg, errFields })
  }

  return res.status(200).json({ success: true, data: { total: resp[`${action}Count`] } })
}

const followUser = async (req, res) => {
  const { user, itemType, item, action } = req.body
  const foundAction = await User.findOne({
    _id: mongoose.Types.ObjectId(item),
    followers: { $in: [mongoose.Types.ObjectId(user)] }
  })
  console.log(foundAction)
  if (foundAction) {
    return res.status(401).json({ success: false, errMsg: 'This relation already exist' })
  }
  try {
    const followee = await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(item) },
      { $addToSet: { followers: mongoose.Types.ObjectId(user) } },
      { new: true, upsert: true }
    )

    const followersArray = [...followee.followers]

    await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(item) },
      { followersCount: followersArray.length },
      { upsert: true }
    )

    const follower = await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(user) },
      { $addToSet: { following: mongoose.Types.ObjectId(item) } },
      { new: true, upsert: true }
    )

    const followingArray = [...follower.following]

    await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(user) },
      { followingCount: followingArray.length },
      { upsert: true }
    )

    await Relation.create(req.body)
  } catch (err) {
    const { errMsg, errFields } = mapMongooseErrors(err)
    return res.status(401).json({ success: false, errMsg, errFields })
  }

  return res.status(200).json({ success: true })
}

const unFollowUser = async (req, res) => {
  const { user, itemType, item, action } = req.body
  try {
    const followee = await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(item) },
      { $pull: { followers: mongoose.Types.ObjectId(user) } },
      { new: true, upsert: true }
    )

    const followersArray = [...followee.followers]

    await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(item) },
      { followersCount: followersArray.length },
      { upsert: true }
    )

    const follower = await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(user) },
      { $pull: { following: mongoose.Types.ObjectId(item) } },
      { new: true, upsert: true }
    )

    const followingArray = [...follower.following]

    await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(user) },
      { followingCount: followingArray.length },
      { upsert: true }
    )

    await Relation.findOneAndUpdate(
      { user, itemType, item, action, finishedAt: null },
      { finishedAt: Date.now() },
      { upsert: true }
    )
  } catch (err) {
    const { errMsg, errFields } = mapMongooseErrors(err)
    return res.status(401).json({ success: false, errMsg, errFields })
  }

  return res.status(200).json({ success: true })
}

const remove = async (req, res) => {
  const { user, itemType, item, action } = req.body
  let resp
  try {
    const updatedAction = await mongoose
      .model(itemType)
      .findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(item) },
        { $pull: { [action]: mongoose.Types.ObjectId(user) } },
        { new: true, upsert: true }
      )
    await Relation.findOneAndUpdate(
      { user, itemType, item, action, finishedAt: null },
      { finishedAt: Date.now() },
      { upsert: true }
    )
    const updatedArray = [...updatedAction[action]]
    resp = await mongoose
      .model(itemType)
      .findOneAndUpdate(
        { _id: mongoose.Types.ObjectId(item) },
        { [`${action}Count`]: updatedArray.length },
        { new: true, upsert: true }
      )
  } catch (err) {
    const { errMsg, errFields } = mapMongooseErrors(err)
    return res.status(401).json({ success: false, errMsg, errFields })
  }
  return res.status(200).json({ success: true, data: { total: resp[`${action}Count`] } })
}

const filter = async (req, res) => {
  let { type, item, action, page = 1, limit = 25 } = req.query
  page = parseInt(page)
  limit = parseInt(limit)
  const results = await Relation.paginate(
      { itemType: type, item: mongoose.Types.ObjectId(item), action, finishedAt: null },
      { page,
        limit,
        populate: { path: 'user', select: '_id avatar firstName lastName wechatName' }
      })
  res.status(200).json({
    success: true,
    data: results
  })
}


const activateCoupon = async (req, res) => {
  const { user, itemType, item, action } = req.body
  const foundAction = await User.findOne({
    _id: mongoose.Types.ObjectId(item),
    coupons: { $in: [mongoose.Types.ObjectId(user)] }
  })
  console.log(foundAction)
  if (foundAction) {
    return res.status(401).json({ success: false, errMsg: 'This relation already exist' })
  }
  try {
    const followee = await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(item) },
      { $addToSet: { followers: mongoose.Types.ObjectId(user) } },
      { new: true, upsert: true }
    )

    const followersArray = [...followee.followers]

    await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(item) },
      { followersCount: followersArray.length },
      { upsert: true }
    )

    const follower = await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(user) },
      { $addToSet: { following: mongoose.Types.ObjectId(item) } },
      { new: true, upsert: true }
    )

    const followingArray = [...follower.following]

    await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(user) },
      { followingCount: followingArray.length },
      { upsert: true }
    )

    await Relation.create(req.body)
  } catch (err) {
    const { errMsg, errFields } = mapMongooseErrors(err)
    return res.status(401).json({ success: false, errMsg, errFields })
  }

  return res.status(200).json({ success: true })
}

const deactivateCoupon = async (req, res) => {
  const { user, itemType, item, action } = req.body
  try {
    const followee = await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(item) },
      { $pull: { followers: mongoose.Types.ObjectId(user) } },
      { new: true, upsert: true }
    )

    const followersArray = [...followee.followers]

    await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(item) },
      { followersCount: followersArray.length },
      { upsert: true }
    )

    const follower = await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(user) },
      { $pull: { following: mongoose.Types.ObjectId(item) } },
      { new: true, upsert: true }
    )

    const followingArray = [...follower.following]

    await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(user) },
      { followingCount: followingArray.length },
      { upsert: true }
    )

    await Relation.findOneAndUpdate(
      { user, itemType, item, action, finishedAt: null },
      { finishedAt: Date.now() },
      { upsert: true }
    )
  } catch (err) {
    const { errMsg, errFields } = mapMongooseErrors(err)
    return res.status(401).json({ success: false, errMsg, errFields })
  }

  return res.status(200).json({ success: true })
}

module.exports = {
  create,
  remove,
  followUser,
  unFollowUser,
  filter
}
