const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const Referral = sequelize.define('Referral', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  jobId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Jobs',
      key: 'id'
    }
  },
  requesterId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  referrerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED'),
    defaultValue: 'PENDING',
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  responseMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['jobId']
    },
    {
      fields: ['requesterId']
    },
    {
      fields: ['referrerId']
    },
    {
      fields: ['status']
    },
    {
      unique: true,
      fields: ['jobId', 'requesterId', 'referrerId'] // Prevent duplicate requests
    }
  ]
})

// Define associations
Referral.associate = (models) => {
  // Referral belongs to a job
  Referral.belongsTo(models.Job, {
    foreignKey: 'jobId',
    as: 'job'
  })

  // Referral belongs to requester (fresher)
  Referral.belongsTo(models.User, {
    foreignKey: 'requesterId',
    as: 'requester'
  })

  // Referral belongs to referrer (professional)
  Referral.belongsTo(models.User, {
    foreignKey: 'referrerId',
    as: 'referrer'
  })
}

module.exports = Referral