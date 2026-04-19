const express = require('express')
const router = express.Router()
const { getProfile, updateProfile, getUsers } = require('./profile.controller')
const { protect } = require('../../middleware/auth')

// All profile routes are protected
router.use(protect)

router.get('/', getProfile)
router.patch('/', updateProfile)
router.get('/users', getUsers)

module.exports = router
