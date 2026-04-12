const path = require('path')
const { Sequelize } = require('sequelize')
const mongoose = require('mongoose')
require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const sequelize = new Sequelize(process.env.PG_URI, {
  dialect: 'postgres',
  logging: false,
})

const connectPostgres = async () => {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ alter: true })
    console.log('PostgreSQL connected!')
  } catch (err) {
    console.error('PostgreSQL error:', err.message)
    process.exit(1)
  }
}

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('MongoDB connected!')
  } catch (err) {
    console.error('MongoDB error:', err.message)
    process.exit(1)
  }
}

module.exports = { sequelize, connectPostgres, connectMongo }