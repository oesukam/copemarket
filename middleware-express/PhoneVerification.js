const { User, PhoneVerification } = require('../models')
const { getOpenId, decryptUserInfo } = require('../utils/wechatAuthorization')
const moment = require('moment')

const validateAttempt = async (req, res, next) => {
  const { countryCode, phoneNumber, user } = req.body
  const phone = countryCode + phoneNumber
  const isPhoneNumberUsed = await User.findOne({ phone })
  if (isPhoneNumberUsed) {
    return res.status(403).json({ success: false, errMsg: 'Phone number is already in use' })
  }
  const limitFrom = moment()
    .subtract(2, 'hours')
    .valueOf()
  const limitTo = moment().valueOf()
  const verificationAttempts = PhoneVerification.find({
    user,
    createdAt: { $gte: limitFrom, $lte: limitTo }
  })
  if (verificationAttempts.length === 3) {
    return res.status(403).json({ success: false, errMsg: 'Number of attempts execeeded' })
  }
  next()
}

const validateCode = async (req, res, next) => {
  let { phoneNumber, user, verificationCode, action, countryCode } = req.body
  const foundItems = await PhoneVerification.find({ user, phoneNumber, countryCode, verificationCode, action })
  if (foundItems.length === 0) {
    return res
      .status(403)
      .json({ success: false, errMsg: 'Please make the phone verification first' })
  }
  const lastItem = foundItems[foundItems.length - 1]
  const timeLimit = moment(lastItem.createdAt).add(10, 'minutes')
  if (lastItem.createdAt > timeLimit) {
    return res
      .status(403)
      .json({ success: false, errMsg: 'Verification code is not valid anymore, please try again' })
  }
  req.params.id = lastItem._id
  next()
}

const  wechatVerification = async (req, res, next) => {
  const { js_code, iv, encryptedData, user } = req.body
  let data
  try {
    const resp = await getOpenId(js_code)
    data = resp.data
  } catch (err) {
    return res.status(403).json({ success: false, errMsg: 'Error retrieving the sesion key from wechat' })
  }
  if (data.errcode || data.errmsg) {
    return res.status(403).json({ success: false, errMsg: data.errmsg, errCode: data.errcode })
  }
  const { session_key } = data
  if (!session_key) {
    return res.status(403).json({ success: false, errMsg: 'Please try again' })
  }
  const { phoneNumber, countryCode } = decryptUserInfo(session_key, iv, encryptedData)
  req.body.phoneNumber = phoneNumber !== '' ? phoneNumber : ''
  req.body.countryCode = countryCode !== '' ? countryCode : '86' 
  next()
}

module.exports = {
  validateAttempt,
  validateCode,
  wechatVerification
}
