import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../../models/pg/user';

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

const register = async ({ name, email, password, role = 'FRESHER', company, domain, skills }) => {
  const normalizedRole = role.split(' ')[0].toUpperCase() as 'FRESHER' | 'PROFESSIONAL' | 'HR';
  const existing = await User.findOne({ where: { email } })
  if (existing) throw new Error('Email already registered')

  const hashed = await bcrypt.hash(password, 12)
  const user: any = await User.create({
    name, email, password: hashed,
    role: normalizedRole, company, domain, skills,
  })

  const tokens = generateTokens(user)
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, ...tokens }
}

const login = async ({ email, password, role }) => { 
  const normalizedRole = role ? role.split(' ')[0].toUpperCase() : 'FRESHER';
  const user: any = await User.findOne({ where: { email, role: normalizedRole } }) 
  if (!user) throw new Error('Invalid email, password, or role')

  const match = await bcrypt.compare(password, user.password)
  if (!match) throw new Error('Invalid email, password, or role')

  const tokens = generateTokens(user)
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, ...tokens }
}

export { register, login  };