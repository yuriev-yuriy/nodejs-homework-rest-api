const express = require('express')
const router = express.Router()
const userController = require('../../../controllers/users')
const validate = require('./validation')
const guard = require('../../../helpers/guard')
const { createRegLimiter } = require('../../../helpers/rate-limit-reg')
router.post('/registration', createRegLimiter, userController.reg)
router.post('/login', userController.login)
router.post('/logout', guard, userController.logout)
router.get('/current', guard, userController.getCurrent)

module.exports = router
