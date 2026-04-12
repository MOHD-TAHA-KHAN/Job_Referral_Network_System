const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('FRESHER', 'PROFESSIONAL', 'HR'),
    defaultValue: 'FRESHER',
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  domain: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  resumeUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  referralSuccessRate: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
}, {
  timestamps: true,
})

module.exports = User