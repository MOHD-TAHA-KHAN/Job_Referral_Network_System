require('dotenv').config()
const { Sequelize } = require('sequelize')

console.log('Connecting to PostgreSQL:', process.env.PG_URI)

const sequelize = new Sequelize(process.env.PG_URI, {
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 20,
    min: 5,
    acquire: 30000,
    idle: 10000
  }
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
      await sequelize.sync({ alter: true })

      console.log('PostgreSQL connected successfully!')
      break
    } catch (err) {
      retries -= 1
      console.log(`PostgreSQL not ready yet... retrying (${retries} left)`)
      if (retries === 0) {
        console.error('PostgreSQL connection failed:', err.message)
        process.exit(1)
      }
      await new Promise(res => setTimeout(res, 5000))
    }
  }
}

module.exports = { sequelize, connectPostgres }