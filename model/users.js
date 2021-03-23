const User = require('./schema/user')

const findByEmail = async (email) => {
  return await User.findOne({ email })
}

const findById = async (id) => {
  return await User.findOne({ _id: id })
}

const findByVerifyToken = async (verifyToken) => {
  return await User.findOne({ verifyToken })
}

const create = async ({ email, password, subscription, verify, verifyToken }) => {
  const user = new User({ email, password, subscription, verify, verifyToken })
  return await user.save()
}

const updateToken = async (id, token) => {
  return await User.updateOne({ _id: id }, { token })
}

const updateVerifyToken = async (id, verify, verifyToken) => {
  return await User.updateOne({ _id: id }, { verify, verifyToken })
}

const updateAvatar = async (id, avatar) => {
  return await User.updateOne({ _id: id }, { avatar })
}

const findByToken = async (token) => {
  return await User.findOne({ token })
}

module.exports = {
  findByEmail, findById, findByVerifyToken, create, updateToken, updateVerifyToken, updateAvatar, findByToken,
}
