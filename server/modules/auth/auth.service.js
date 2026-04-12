const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../../models/pg/User')

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  )
  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  )
  return { accessToken, refreshToken }
}

const register = async ({ name, email, password, role, company, domain, skills }) => {
  const existing = await User.findOne({ where: { email } })
  if (existing) throw new Error('Email already registered')

  const hashed = await bcrypt.hash(password, 12)
  const user = await User.create({
    name, email, password: hashed,
    role, company, domain, skills,
  })

  const tokens = generateTokens(user)
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, ...tokens }
}

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } })
  if (!user) throw new Error('Invalid email or password')

  const match = await bcrypt.compare(password, user.password)
  if (!match) throw new Error('Invalid email or password')

  const tokens = generateTokens(user)
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, ...tokens }
}

module.exports = { register, login }