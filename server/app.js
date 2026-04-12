const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
require('dotenv').config()

const { connectPostgres, connectMongo } = require('./config/db')
require('./config/redis')

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(helmet())const path = require('path')
const { Sequelize } = require('sequelize')
const mongoose = require('mongoose')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const sequelize = new Sequelize(process.env.PG_URI, {
  dialect: 'postgres',
  logging: false,
})
...const path = require('path')
const { Sequelize } = require('sequelize')
const mongoose = require('mongoose')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const sequelize = new Sequelize(process.env.PG_URI, {
  dialect: 'postgres',
  logging: false,
})
...
app.use(morgan('dev'))

// Routes 
// app.use('/api/auth', require('./modules/auth/auth.routes'))
// app.use('/api/users', require('./modules/user/user.routes'))
// app.use('/api/jobs', require('./modules/job/job.routes'))
// app.use('/api/referrals', require('./modules/referral/referral.routes'))
// app.use('/api/analytics', require('./modules/analytics/analytics.routes'))
const authRoutes = require('./modules/auth/auth.routes')
app.use('/api/auth', authRoutes)

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'RefNet API is running!' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong', error: err.message })
})

const PORT = process.env.PORT || 5000

// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`)
// })

const start = async () => {
  await connectPostgres()
  await connectMongo()
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

start()

module.exports = app