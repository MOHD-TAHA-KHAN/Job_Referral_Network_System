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
    type: DataTypes.ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'WITHDRAWN'),
    defaultValue: 'PENDING',
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 2000]
    }
  },
  responseMessage: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 2000]
    }
  },
  priority: {
    type: DataTypes.ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT'),
    defaultValue: 'NORMAL',
    allowNull: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  acceptedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completedAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  rejectionReason: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 500]
    }
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: [0, 1000]
    }
  },
  isUrgent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  followUpRequired: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  followUpDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
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
      fields: ['priority']
    },
    {
      fields: ['expiresAt']
    },
    {
      fields: ['acceptedAt']
    },
    {
      fields: ['completedAt']
    },
    {
      fields: ['createdAt']
    },
    {
      fields: ['isUrgent']
    },
    {
      fields: ['followUpRequired']
    },
    {
      fields: ['followUpDate']
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