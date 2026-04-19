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

// Define associations
User.associate = (models) => {
  // HR users can create jobs
  User.hasMany(models.Job, {
    foreignKey: 'createdBy',
    as: 'createdJobs'
  })

  // Users can request referrals (as freshers)
  User.hasMany(models.Referral, {
    foreignKey: 'requesterId',
    as: 'requestedReferrals'
  })

  // Users can receive referral requests (as professionals)
  User.hasMany(models.Referral, {
    foreignKey: 'referrerId',
    as: 'receivedReferrals'
  })
}

module.exports = User