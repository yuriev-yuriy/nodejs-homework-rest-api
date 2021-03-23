const jwt = require('jsonwebtoken')
const Users = require('../model/users')
const fs = require('fs').promises
const path = require('path')
const Jimp = require('jimp')
const { nanoid } = require('nanoid')
const { HttpCode } = require('../helpers/constants')
const EmailService = require('../services/email')
const createFolderExist = require('../helpers/create-dir')
require('dotenv').config()
const SECRET_KEY = process.env.JWT_SECRET

const reg = async (req, res, next) => {
  try {
    const { email, name } = req.body
    const user = await Users.findByEmail(email)
    if (user) {
      return res.status(HttpCode.CONFLICT).json({
        status: 'error',
        code: HttpCode.CONFLICT,
        data: 'Conflict',
        message: 'Email in use'
      })
    }
    const verifyToken = nanoid()
    const emailService = new EmailService()(process.env.NODE_ENV)
    await emailService.sendEmail(verifyToken, email, name)
    const newUser = await Users.create({ ...req.body, verify: false, verifyToken })
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      code: HttpCode.CREATED,
      data: {
        id: newUser.id,
        email: newUser.email,
        subscription: newUser.subscription,
        avatar: newUser.avatar,
      },
    })
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await Users.findByEmail(email)
    const isValidPassword = await user?.validPassword(password)
    if (!user || !isValidPassword || !user.verify) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        data: 'UNAUTHORIZED',
        message: 'invalid credentials'
      })
    }
    const id = user._id
    const payload = { id }
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '2h' })
    await Users.updateToken(id, token)
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        token,
      },
    })
  } catch (err) {
    next(err)
  }
}

const getCurrent = async (req, res, next) => {
  try {
    const { token } = req.body
    const user = await Users.findByToken(token)
    if (!user) {
      return res.status(HttpCode.UNAUTHORIZED).json({
        status: 'error',
        code: HttpCode.UNAUTHORIZED,
        data: 'UNAUTHORIZED',
        message: 'Not authorized'
      })
    }
    return res.status(HttpCode.OK).json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        email: user.email,
        subscription: user.subscription,
      },
    })
  } catch (err) {
    next(err)
  }
}

const logout = async (req, res, next) => {
  const id = req.user.id
  await Users.updateToken(id, null)
  return res.status(HttpCode.NO_CONTENT).json({})
}

const avatars = async (req, res, next) => {
  try {
    const id = req.user.id
    const avatarUrl = await saveAvatarToStaic(req)
    await Users.updateAvatar(id, avatarUrl)
    return res.json({
      status: 'success',
      code: HttpCode.OK,
      data: {
        avatarUrl,
      },
    })
  } catch (err) {
    next(err)
  }
}
const saveAvatarToStaic = async (req) => {
  const id = req.user.id
  const AVATARS_OF_USERS = process.env.AVATARS_OF_USERS
  const AVATARS_INNER = process.env.AVATARS_INNER
  const pathFile = req.file.path
  const newNameAvatar = `${req.file.originalname}`
  const img = await Jimp.read(pathFile)
  await img
    .autocrop()
    .cover(
      250,
      250,
      Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_MIDDLE,)
    .writeAsync(pathFile)
  await createFolderExist(path.join(AVATARS_OF_USERS, AVATARS_INNER))
  await fs.rename(pathFile, path.join(AVATARS_OF_USERS, AVATARS_INNER, newNameAvatar))
  const avatarUrl = path.normalize(newNameAvatar)
  try {
    await fs.unlink(path.join(process.cwd(), AVATARS_OF_USERS, req.user.avatar),)
  } catch (err) {
    console.log(err.message)
  }
  return avatarUrl
}

const verify = async (req, res, next) => {
  try {
    const user = Users.findByVerifyToken(req.params.token)
    if (user) {
      await Users.updateVerifyToken(user.id, true, null)
      return res.json({
        status: 'success',
        code: HttpCode.OK,
        message: 'Verification successful'
      })
    }
    return res.status(HttpCode.BAD_REQUEST).json({
      status: 'error',
      code: HttpCode.BAD_REQUEST,
      data: 'Bad request',
      message: 'Too many requests, try again later'
    })
  } catch (err) {
    next(err)
  }
}

module.exports = { reg, login, logout, getCurrent, avatars, verify }
