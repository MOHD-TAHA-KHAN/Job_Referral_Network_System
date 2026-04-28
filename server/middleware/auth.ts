
import jwt from 'jsonwebtoken';

const protect = (req: any, res: any, next: any) => {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' })
  }

  const token = header.split(' ')[1]
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err: any) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

const allowRoles = (...roles) => (req: any, res: any, next: any) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied' })
  }
  next()
}

export { protect, allowRoles  };