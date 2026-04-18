const express = require('express')
const router = express.Router()
const { register, login, refresh, logout } = require('./auth.controller')
const { protect } = require('../../middleware/auth')
const passport = require('../../config/passport')
const jwt = require('jsonwebtoken')

// Existing routes
router.post('/register', register)
router.post('/login', login)
router.post('/refresh', refresh)
router.post('/logout', logout)

// Protected test route
router.get('/me', protect, (req, res) => {
  res.json({ success: true, user: req.user })
})

// Google OAuth routes
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
)

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT after Google login
    const accessToken = jwt.sign(
      { id: req.user.id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
      { id: req.user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    )

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    })

    // Redirect to frontend with token
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${accessToken}`)
  }
)

module.exports = router