const authService = require('./auth.service')
const jwt = require('jsonwebtoken')

const setTokenCookie = (res, token) => {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  })
}

const register = async (req, res) => {
  try {
    const result = await authService.register(req.body)
    setTokenCookie(res, result.refreshToken)
    res.status(201).json({ success: true, user: result.user, accessToken: result.accessToken })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body)
    setTokenCookie(res, result.refreshToken)
    res.status(200).json({ success: true, user: result.user, accessToken: result.accessToken })
  } catch (err) {
    res.status(401).json({ success: false, message: err.message })
  }
}

const refresh = async (req, res) => {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' })

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
    // Create new access token
    const User = require('../../models/pg/User')
    const user = await User.findByPk(decoded.id)
    if (!user) throw new Error('User not found')

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    )
    
    res.json({ success: true, accessToken })
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired refresh token' })
  }
}

const logout = (req, res) => {
  res.clearCookie('refreshToken')
  res.json({ success: true, message: 'Logged out successfully' })
}

module.exports = { register, login, refresh, logout }