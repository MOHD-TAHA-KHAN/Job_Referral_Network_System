require('dotenv').config()
const { Sequelize } = require('sequelize')
const mongoose = require('mongoose')

console.log('Connecting to PG:', process.env.PG_URI)

const sequelize = new Sequelize(process.env.PG_URI, {
  dialect: 'postgres',
  logging: false,
})

const connectPostgres = async () => {
  let retries = 10
  while (retries) {
    try {
      // Initialize model associations BEFORE authenticate/sync
      const User = require('../models/pg/user')
      const Job = require('../models/pg/job')
      const Referral = require('../models/pg/referral')

      // Set up associations
      User.associate({ Job, Referral })
      Job.associate({ User, Referral })
      Referral.associate({ Job, User })

      await sequelize.authenticate()
      await sequelize.sync({ force: true })

      console.log('PostgreSQL connected!')
      break
    } catch (err) {
      retries -= 1
      console.log(`PostgreSQL not ready yet... retrying (${retries} left)`)
      if (retries === 0) {
        console.error('PostgreSQL failed:', err.message)
        process.exit(1)
      }
      await new Promise(res => setTimeout(res, 5000))
    }
  }
}

const connectMongo = async () => {
  let retries = 10
  while (retries) {
    try {
      await mongoose.connect(process.env.MONGO_URI)
      console.log('MongoDB connected!')
      break
    } catch (err) {
      retries -= 1
      console.log(`MongoDB not ready yet... retrying (${retries} left)`)
      if (retries === 0) {
        console.error('MongoDB failed:', err.message)
        process.exit(1)
      }
      await new Promise(res => setTimeout(res, 5000))
    }
  }
}

module.exports = { sequelize, connectPostgres, connectMongo }