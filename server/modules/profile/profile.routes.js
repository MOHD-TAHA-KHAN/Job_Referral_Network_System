const express = require('express')
const router = express.Router()
const { getProfile, updateProfile } = require('./profile.controller')
const { protect } = require('../../middleware/auth')

// All profile routes are protected
router.use(protect)

router.get('/', getProfile)
router.patch('/', updateProfile)

module.exports = router
