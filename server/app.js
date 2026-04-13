require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

const { connectPostgres, connectMongo } = require('./config/db')
require('./config/redis')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())
app.use(helmet())
app.use(morgan('dev'))

app.use('/api/auth', require('./modules/auth/auth.routes'))

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

const PORT = process.env.PORT || 5000

const start = async () => {
  await connectPostgres()
  await connectMongo()
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

start()
module.exports = app