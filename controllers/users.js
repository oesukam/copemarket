const { User, Token, Review, Conversation, Relation, PurchasedCoupon } = require('../models')
const { signAuthenticationToken } = require('../../utils/authorizationTools')
const { getOpenId } = require('../../utils/wechatAuthorization')
const { mapMongooseErrors } = require('../../utils/formatErrors')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const signUpWithEmailAndPassword = async (req, res) => {
  const data = req.body
  data['createdAt'] = Date().now()
  data['updatedAt'] = Date().now()
  let { account, password } = data

  const foundUser = await User.findOne({ account })

  if (foundUser) {
    return res.status(403).json({ success: false, errMsg: 'Email is already in use' })
  }

  data.password = await bcrypt.hash(data.password, 10)
  let newUser

  try {
    newUser = await User.create(data)
  } catch (error) {
    const { errMsg, errFields } = mapMongooseErrors(error)
    return res.status(401).json({ success: false, errMsg, errFields })
  }
  const token = signAuthenticationToken(newUser)

  try {
    await Token.create({ token, user: newUser._id })
  } catch (err) {
    const { errMsg, errFields } = mapMongooseErrors(err)
    return res.status(401).json({ success: false, errMsg, errFields })
  }

  return res.status(201).json({ success: true, data: { token, data: newUser } })
}

const signInWithEmailAndPassword = async (req, res) => {
  const { account, password } = req.body
  let foundUser = await User.findOne({ account }).select(
    'avatar firstName lastName account password gender birthDate language email phone wechatName wechatId useWechat useEmail about firstLogin isVerified followingCount followersCount role country province city profession'
  )
  if (!foundUser) {
    return res.status(401).json({ success: false, errMsg: 'Unauthorized' })
  }
  const pswd = await bcrypt.hash(password, 10)
  const validPassword = await bcrypt.compare(password, foundUser.password)
  if (!validPassword) {
    return res.status(401).json({ success: false, errMsg: 'Unauthorized' })
  }
  foundUser.firstLogin = false
  foundUser.loggedInAt = Date.now()
  try {
    foundUser.save()
  } catch (err) {
    const { errMsg, errFields } = mapMongooseErrors(err)
    return res.status(401).json({ success: false, errMsg, errFields })
  }
  let token
  const foundToken = await Token.findOne({
    user: mongoose.Types.ObjectId(foundUser._id),
    valid: true
  })
  if (!foundToken) {
    // Generate new token for the user
    token = signAuthenticationToken(foundUser)
    try {
      await Token.create({ token, user: foundUser._id })
    } catch (err) {
      const { errMsg, errFields } = mapMongooseErrors(err)
      return res.status(401).json({ success: false, errMsg, errFields })
    }
  } else {
    token = foundToken.token
  }
  return res.status(200).json({ success: true, data: { token, user: foundUser } })
}

const wechatAuthentication = async (req, res) => {
  const { id = null } = req.params

  let foundUser
  try {
    if (id) {
      foundUser = await User.findOne({ _id: mongoose.Types.ObjectId(id) }).select(
        'avatar firstName lastName account gender birthDate language email phone wechatName wechatId useWechat useEmail about firstLogin isVerified followingCount followersCount role country province city profession'
      )
      foundUser.firstLogin = false
      foundUser.loggedInAt = Date.now()
      foundUser.save()
    } else {
      const data = req.body
      data['loggedInAt'] =  Date.now()
      foundUser = await User.create(data)
    }
  } catch (err) {
    const { errMsg, errFields } = mapMongooseErrors(err)
    return res.status(403).json({ success: false, errMsg, errFields })
  }

  let token
  const foundToken = await Token.findOne({
    user: mongoose.Types.ObjectId(foundUser._id),
    status: 'valid'
  })
  if (!foundToken) {
    // Generate new token for the user
    token = signAuthenticationToken(foundUser)
    try {
      await Token.create({ token, user: foundUser._id })
    } catch (err) {
      const { errMsg, errFields } = mapMongooseErrors(err)
      return res.status(401).json({ success: false, errMsg, errFields })
    }
  } else {
    token = foundToken.token
  }
  return res.status(200).json({ success: true, data: { token, user: foundUser } })
}

const signout = async (req, res) => {
  const { authorization } = req.headers
  const { currentUser } = req.body

  try {
    await Token.findOneAndUpdate(
      { token: authorization, user: currentUser },
      { valid: false },
      { upsert: true }
    )
  } catch (err) {
    const { errMsg, errFields } = mapMongooseErrors(err)
    return res.status(statusCode).json({ success: false, errMsg, errFields })
  }

  return res.status(200).json({ success: true })
}

const create = async (req, res) => {
  const data = req.body
  data['createdAt'] = Date().now()
  data['updatedAt'] = Date().now()
  let statusCode = 200
  if (data['password']) {
    data['password'] = await bcrypt.hash(data.password, 10)
  }
  try {
    const newUser = new User(data)
    const result = await newUser.save()
    const success = result !== null

    res.status(200).json({
      message: 'User successfully created',
      success,
      user: newUser
    })
  } catch (error) {
    statusCode = 401
    const { errMsg, errFields } = mapMongooseErrors(error)
    res.status(statusCode).json({ success: false, errMsg, errFields })
  }
}

const getById = async (req, res) => {
  const { id } = req.params
  const { currentUser } = req.query
  const foundUser = await User.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(id) } },
    {
      $addFields: {
        userIsFollowed: {
          $cond: {
            if: { $in: [mongoose.Types.ObjectId(currentUser), '$followers'] },
            then: true,
            else: false
          }
        }
      }
    },
    {
      $project: {
        password: 0,
        openId: 0,
        unionId: 0,
        followers: 0,
        following: 0,
        createdAt: 0,
        updatedAt: 0,
        uid: 0
      }
    }
  ])
  if (foundUser.length === 0) {
    return res.status(401).json({
      success: false,
      errMsg: 'User Not found'
    })
  }
  res.status(200).json({
    success: true,
    data: foundUser[0]
  })
}

const getSocial = async (req, res) => {
  const { id } = req.params
  let { filter, page = 1, limit = 25 } = req.query
  page = parseInt(page)
  limit = parseInt(limit)
  let skip = 0
  if (page !== 1) {
    skip = (page - 1) * limit
  }
  const foundItems = await User.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(id) } },
    {
      $project: {
        _id: 0,
        items: { $slice: [`$${filter}`, skip, limit] }
      }
    },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'users',
        localField: 'items',
        foreignField: '_id',
        as: 'items'
      }
    },
    { $unwind: '$items' },
    {
      $project: {
        _id: '$items._id',
        avatar: '$items.avatar',
        firstName: '$items.firstName',
        lastName: '$items.lastName',
        wechatName: '$items.wechatName',
        isUserFollowed: {
          $cond: {
            if: { $in: [mongoose.Types.ObjectId(id), '$items.followers'] },
            then: true,
            else: false
          }
        }
      }
    }
  ])
  return res.status(200).json({ success: true, data: foundItems })
}

const getItemsListing = async (req, res) => {
  const { id } = req.params
  let { filter, page = 1, limit = 25 } = req.query
  page = parseInt(page)
  limit = parseInt(limit)
  let foundItems
  const query = { author: mongoose.Types.ObjectId(id) }
  switch (filter) {
    case 'events':
      foundItems = await mongoose.model('Event').paginate(query, {
        select:
          '_id title titleCn category place startAt endAt startDate thumbnail followers followersCount',
        populate: [
          { path: 'followers', select: '_id avatar', options: { limit: 5 } },
          { path: 'place', select: '_id name' },
          { path: 'category', select: '_id icon name nameCn' }
        ],
        page,
        limit
      })
      break
    case 'places':
      foundItems = await mongoose.model('Place').paginate(query, {
        select:
          '_id thumbnail name type openFrom openTo addressEn addressCn reviewsRate followers followersCount',
        populate: [
          { path: 'type', select: '_id icon name nameCn' },
          { path: 'followers', select: '_id avatar', options: { limit: 5 } }
        ],
        page,
        limit
      })
      break
    default:
      foundItems = []
      break
  }

  return res.status(200).json({ success: true, data: foundItems })
}

const getFavoriteItems = async (req, res) => {
  const { id } = req.params
  let { filter, page = 1, limit = 25 } = req.query
  page = parseInt(page)
  limit = parseInt(limit)
  const relations = await Relation.paginate(
    {
      user: mongoose.Types.ObjectId(id),
      itemType: filter,
      action: 'follows',
      finishedAt: { $eq: null }
    },
    {
      select: 'item itemType',
      populate: {
        path: 'item',
        select:
          '_id title titleCn name nameCn thumbnail category follows followsCount startDate startAt endAt type addressEn addressCn openFrom openTo reviewsRate',
        populate: [
          { path: 'follows', select: '_id avatar', options: { limit: 5 } },
          { path: 'place', select: '_id name nameCn' },
          { path: 'category', select: '_id name nameCn icon' },
          { path: 'type', select: '_id name nameCn icon' }
        ]
      },
      page,
      limit
    }
  )
  return res.status(200).json({ success: true, data: relations })
}

const getReviews = async (req, res) => {
  const { id } = req.params
  let { page = 1, limit = 25 } = req.query
  page = parseInt(page)
  limit = parseInt(limit)
  const foundReviews = await Review.paginate(
    { user: mongoose.Types.ObjectId(id) },
    {
      populate: {
        path: 'user',
        select: '_id avatar firstName lastName wechatName'
      },
      page,
      limit
    }
  )
  return res.status(200).json({ success: true, data: foundReviews })
}

const getCoupons = async (req, res) => {
  const { id } = req.params
  let {
    page = 1,
    limit = 25,
    place = null,
    notActivated = null,
    purchase = null,
    coupon = null
  } = req.query
  page = parseInt(page)
  limit = parseInt(limit)
  let query = { user: mongoose.Types.ObjectId(id), coupon: { $ne: null } }

  if (place) {
    query['place'] = mongoose.Types.ObjectId(place)
  }
  if (notActivated) {
    query['activated'] = false
  }
  if (purchase) {
    query['_id'] = mongoose.Types.ObjectId(purchase)
  }
  const foundCoupons = await PurchasedCoupon.paginate(query, {
    populate: [
      {
        path: 'coupon',
        select:
          '_id viewsCount thumbnail title titleCn createdBy place category type endDate expireDate originalPrice couponPrice price purchasesCount discountRate',
        populate: [
          {
            path: 'place',
            model: 'Place',
            select: '_id name nameCn thumbnail addressEn, addressCn'
          },
          { path: 'category', select: '_id name nameCn icon' },
          { path: 'type', select: '_id name nameCn icon' }
        ]
      }
    ],
    page,
    limit
  })
  return res.status(200).json({ success: true, data: foundCoupons })
}

const getMessages = async (req, res) => {
  const { id } = req.params
  const query = { participants: { $in: [mongoose.Types.ObjectId(id)] } }
  const options = {
    select: '_id topic users messages',
    populate: [
      {
        path: 'users',
        match: { _id: { $ne: id } },
        select: '_id avatar firstName lastName wechatName'
      },
      { path: 'messages', select: '_id text read createdAt' }
    ]
  }
  const foundConversations = await Conversation.paginate(query, options)
  return res.status(200).json({ success: true, data: foundConversations })
}

const getAll = async (req, res) => {
  let {
    page = 1,
    limit = 25,
    country = null,
    sex = null,
    name = null,
    language = null,
    wechatId = null,
    email = null,
    phone = null,
    role = null,
    university = null,
    userType = null
  } = req.query
  page = parseInt(page)
  limit = parseInt(limit)
  query = {}
  if (country) {
    query['country'] = country
  }
  if (sex) {
    query['gender'] = sex
  }
  if (language) {
    query['language'] = language
  }
  if (wechatId) {
    const weChatReg = RegExp(wechatId)
    query['wechatId'] = { $regex: weChatReg }
  }
  if (email) {
    const emailReg = RegExp(email)
    query['email'] = { $regex: emailReg }
  }
  if (phone) {
    query['phone'] = phone
  }
  if (university) {
    query['university'] = university
  }
  if (name) {
    const reg = new RegExp(name)
    query['firstName'] = { $regex: reg }
  }
  if (role) {
    query['role'] = { $in: [role] }
  }
  if (userType) {
    if (userType === 'admin') {
      query['role'] = { $nin: [0], $not: { $size: 0 } }
    } else {
      query['role'] = { $size: 1, $in: [0] }
    }
  }
  let results = await User.paginate(query, { page, limit })

  const foundUsers = [...results.docs]

  let totalSpent = []
  let totalFollowedEvents
  let totalFollowedPlaces
  let totalReviews

  // Loop the users to add the required counters
  let newUsersArray = []
  for (let key in foundUsers) {
    let singleUser = JSON.parse(JSON.stringify(foundUsers[key]))
    try {
      // get the total amount of money spent on coupons by this user
      totalSpent = await PurchasedCoupon.aggregate([
        { $match: { user: mongoose.Types.ObjectId(singleUser._id) } },
        {
          $group: {
            _id: null,
            sum: { $sum: '$totalFee' }
          }
        }
      ])

      // get the total number of events followed by this user
      totalFollowedEvents = await Relation.find({
        user: mongoose.Types.ObjectId(singleUser._id),
        itemType: 'Event',
        action: 'follows',
        finishedAt: { $eq: null }
      }).count()

      // get the total number of places followed by this user
      totalFollowedPlaces = await Relation.find({
        user: mongoose.Types.ObjectId(singleUser._id),
        itemType: 'Place',
        action: 'follows',
        finishedAt: { $eq: null }
      }).count()

      // get the total number of reviews made by this user
      totalReviews = await Review.find({
        user: mongoose.Types.ObjectId(singleUser._id)
      }).count()
    } catch (err) {
      console.log('[getAllUsers] err', err)
    }

    // Update the user to add the found counters
    ;(singleUser['totalMoneySpent'] = totalSpent.length > 0 ? totalSpent[0].sum : 0),
      (singleUser['followedPlaces'] = totalFollowedPlaces || 0),
      (singleUser['followedEvents'] = totalFollowedEvents || 0),
      (singleUser['reviews'] = totalReviews || 0)

    newUsersArray.push(singleUser)
  } // end for

  // return the final users array
  results = {
    ...results,
    docs: newUsersArray
  }

  return res.status(200).json({
    success: true,
    data: results
  })
}

const update = async (req, res) => {
  const { id } = req.params
  let data = req.body
  data['updatedAt'] = Date.now()
  const foundUser = await User.findOne({ _id: mongoose.Types.ObjectId(id) })
  if (!foundUser) {
    return res.status(200).json({ success: true, data: foundUser })
  }
  let updatedUser
  if (foundUser.phone !== data.phone) {
    data.isVerified = false
  }
  try {
    updatedUser = await User.findOneAndUpdate({ _id: mongoose.Types.ObjectId(id) }, data, {
      new: true,
      upsert: true
    })
  } catch (error) {
    const { errMsg, errFields } = mapMongooseErrors(error)
    return res.status(401).json({ success: false, errMsg, errFields })
  }
  return res.status(200).json({
    success: true,
    data: updatedUser
  })
}

const remove = async (req, res) => {
  const { id } = req.params
  let removedUser
  try {
    removedUser = await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(id) },
      { status: 'notAvailable' },
      { new: true, upsert: true }
    )
  } catch (error) {
    const { errMsg, errFields } = mapMongooseErrors(error)
    return res.status(401).json({ success: false, errMsg, errFields })
  }
  res.status(200).json({
    success: true,
    data: removedUser
  })
}

const removeHrUser = async (req, res) => {
  const { id } = req.params
  try {
    await User.findOneAndRemove({ _id: mongoose.Types.ObjectId(id) })
  } catch (error) {
    const { errMsg, errFields } = mapMongooseErrors(error)
    return res.status(401).json({ success: false, errMsg, errFields })
  }
  res.status(200).json({
    success: true
  })
}

module.exports = {
  signUpWithEmailAndPassword,
  signInWithEmailAndPassword,
  wechatAuthentication,
  create,
  getById,
  getAll,
  update,
  remove,
  signout,
  getSocial,
  getItemsListing,
  getFavoriteItems,
  getReviews,
  getMessages,
  getCoupons,
  removeHrUser
}
