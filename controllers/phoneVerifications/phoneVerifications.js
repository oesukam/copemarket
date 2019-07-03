const { PhoneVerification, User } = require('../../models')
const { mapMongooseErrors } = require('../../utils/formatErrors')
const { sendVerificationCodeSMS } = require('../../utils/phoneVerification')
const moment = require('moment')
const mongoose = require('mongoose')

const create = async (req, res) => {
  const { countryCode, phoneNumber } = req.body
  sendVerificationCodeSMS(phoneNumber, countryCode, async (success, message, verificationCode) => {
    if (!success) {
      return res.status(403).json({ success: false, errMsg: message })
    }
    try {
      await PhoneVerification.create({ ...req.body, verificationCode })
      return res.status(200).json({ success: true })
    } catch (err) {
      const { errMsg, errFields } = mapMongooseErrors(err)
      return res.status(403).json({ success: false, errMsg, errFields })
    }
  })
}

const update = async (req, res) => {
  const { phoneNumber, user, countryCode } = req.body
  const { id } = req.params
  try {
    await PhoneVerification.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(id) },
      { verified: true },
      { upsert: true }
    )

    await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(user) },
      { phone: phoneNumber, countryCode, isVerified: true },
      { upsert: true }
    )
  } catch (err) {
    const { errMsg, errFields } = mapMongooseErrors(err)
    return res.status(403).json({ success: false, errMsg, errFields })
  }
  return res.status(200).json({ success: true })
}

const wechatVerification = async (req, res) => {
  const { phoneNumber, user, countryCode } = req.body
  try {
    await PhoneVerification.create({
      user,
      phoneNumber,
      countryCode,
      action: 'wechatVerification',
      verified: true
    })

    await User.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(user) },
      { phone: phoneNumber, countryCode, isVerified: true },
      { upsert: true }
    )
  } catch (err) {
    const { errMsg, errFields } = mapMongooseErrors(err)
    return res.status(403).json({ success: false, errMsg, errFields })
  }
  return res.status(200).json({ success: true, data: { countryCode, phoneNumber } })
} 

module.exports = {
  create,
  update,
  wechatVerification
}
