require('dotenv').config()
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const session = require('express-session')
const passport = require('./config/passport')

const { connectPostgres } = require('./config/db')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet())
app.use(morgan('dev'))

app.use(cookieParser());
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true // Mandatory for sending cookies across origins
}));

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}))

app.use(passport.initialize())
app.use(passport.session())

app.use('/api/auth', require('./modules/auth/auth.routes'))
app.use('/api/profile', require('./modules/profile/profile.routes'))
app.use('/api/jobs', require('./modules/jobs/jobs.routes'))
app.use('/api/referrals', require('./modules/referral/referral.routes'))

app.get('/', (req, res) => {
  res.json({ message: 'RefNet API is running!' })
})

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong' })
})

const DEFAULT_PORT = 5000
const envPort = process.env.PORT ? parseInt(process.env.PORT, 10) : null
const PORTS_TO_TRY = envPort
  ? Array.from(new Set([envPort, envPort + 1, envPort + 2]))
  : [DEFAULT_PORT, DEFAULT_PORT + 1, DEFAULT_PORT + 2]

const listen = (port) => new Promise((resolve, reject) => {
  const server = app.listen(port, () => resolve(server))
  server.on('error', reject)
})

const start = async () => {
  await connectPostgres()

  let server
  for (const port of PORTS_TO_TRY) {
    try {
      server = await listen(port)
      console.log(`Server running on http://localhost:${port}`)
      return
    } catch (error) {
      if (error.code === 'EADDRINUSE') {
        console.warn(`Port ${port} is already in use.`)
        continue
      }
      throw error
    }
  }

  console.error(`All fallback ports are in use: ${PORTS_TO_TRY.join(', ')}`)
  process.exit(1)
}

start().catch((error) => {
  console.error('Failed to start server:', error)
  process.exit(1)
})

module.exports = app
