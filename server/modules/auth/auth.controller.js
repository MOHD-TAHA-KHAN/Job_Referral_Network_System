const authService = require('./auth.service')

const register = async (req, res) => {
  try {
    const result = await authService.register(req.body)
    res.status(201).json({ success: true, data: result })
  } catch (err) {
    res.status(400).json({ success: false, message: err.message })
  }
}

const login = async (req, res) => {
  try {
    const result = await authService.login(req.body)
    res.status(200).json({ success: true, data: result })
  } catch (err) {
    res.status(401).json({ success: false, message: err.message })
  }
}

module.exports = { register, login }