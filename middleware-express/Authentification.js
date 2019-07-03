const bcrypt = require('bcrypt')
const { User, Token } = require('../models')
const { signAuthenticationToken, validateToken } = require('../utils/authorizationTools')
const { getOpenId, decryptUserInfo } = require('../utils/wechatAuthorization')
const mongoose = require('mongoose')

const authenticationWithWechat = async (req, res, next) => {
  const { js_code, iv, encryptedData } = req.body
  const request = getOpenId(js_code)
  request
    .then(async response => {
      const { data } = response
      if (data.errcode || data.errmsg) {
        return res.status(403).json({ success: false, errMsg: data.errmsg, errCode: data.errcode })
      }
      const { openid, session_key } = data
      if (!session_key) {
        return res.status(403).json({ success: false, errMsg: 'Please try again' })
      }
      const { unionId } = decryptUserInfo(session_key, iv, encryptedData)
      if (!unionId) {
        return res.status(403).json({ success: false, errMsg: 'Could not decrypt user info' })
      }
      const foundUser = await User.findOne({ account: unionId })
      if (!foundUser) {
        req.body.account = unionId
        req.body.unionId = unionId
        req.body.openId = openid
      } else {
        User.findOneAndUpdate({ account: unionId }, { openId: openid }, { upsert: true })
        req.params.id = foundUser._id
      }
      next()
    })
    .catch(error => {
      return res.status(403).send({ success: false, errMsg: error })
    })
}

const accessTokenVerification = async (req, res, next) => {
  const { authorization } = req.headers
  if (!authorization) {
    return res.status(401).json({ success: false, errMsg: 'Unauthorized' })
  }
  const tokenIsValid = validateToken(authorization)
  if (!tokenIsValid) {
    return res.status(401).json({ success: false, errMsg: 'Unauthorized' })
  }

  const found = await User.findOne({ account: tokenIsValid.data }).select(
    '_id account isVerified status language role'
  )

  if (!found) {
    return res.status(401).json({ success: false, errMsg: 'Unauthorized' })
  }

  const tokenIsNotExpired = await Token.findOne({
    token: authorization,
    user: found._id,
    valid: true
  })

  if (!tokenIsNotExpired) {
    return res.status(401).json({ success: false, errMsg: 'Unauthorized' })
  }

  req.user = found._id

  next()
}

const userAccessVerification = payload => {
  return async (req, res, next) => {
    const { isCurrentUser = false, accessRole = 0, isPhoneVerified = false } = payload

    if (!req.user) {
      return res.status(401).json({ success: false, errMsg: 'Unauthorized' })
    }

    const currentUser = await User.findOne({ _id: mongoose.Types.ObjectId(req.user) })

    if (currentUser.status !== 'available') {
      return res.status(401).json({ success: false, errMsg: 'Unauthorized' })
    }

    if (isPhoneVerified && !currentUser.isVerified) {
      return res.status(401).json({ success: false, errMsg: 'Unauthorized' })
    }

    if (accessRole !== 0 && currentUser.role.indexOf(accessRole) === -1) {
      return res.status(403).json({ success: false, errMsg: 'Forbidden' })
    }

    if (isCurrentUser) {
      const { id } = req.params
      if (currentUser.role.indexOf(100) === -1) {
        if (String(currentUser._id) !== id) {
          return res.status(403).json({ success: false, errMsg: 'Forbidden' })
        }
      }
    }

    next()
  }
}

const wechatAuth = async (req, res, next) => {
  const { js_code } = req.body
  const request = getOpenId(js_code)
  request
    .then(({ data }) => {
      if (data.errcode || data.errmsg) {
        return res.status(403).json({ success: false, errMsg: data.errmsg, errCode: data.errcode })
      }
      const { openid } = data
      if (!openid) {
        return res
          .status(403)
          .json({ success: false, errMsg: 'No openid was obtained, please try again' })
      }
      req.body.openid = openid
      next()
    })
    .catch(err => console.log('[wechatAuth] err', err))
}

module.exports = {
  authenticationWithWechat,
  accessTokenVerification,
  userAccessVerification,
  wechatAuth
}
