const { DataTypes } = require('sequelize')
const { sequelize } = require('../../config/db')

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  requiredSkills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    allowNull: false,
  },
  domain: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salaryMin: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  salaryMax: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users', // Sequelize pluralizes table names
      key: 'id'
    }
  },
}, {
  timestamps: true,
  indexes: [
    {
      fields: ['company']
    },
    {
      fields: ['domain']
    },
    {
      fields: ['location']
    },
    {
      fields: ['createdBy']
    }
  ]
})

// Define associations
Job.associate = (models) => {
  // Job belongs to the HR user who created it
  Job.belongsTo(models.User, {
    foreignKey: 'createdBy',
    as: 'creator'
  })

  // Job can have many referral requests
  Job.hasMany(models.Referral, {
    foreignKey: 'jobId',
    as: 'referrals'
  })
}

module.exports = Job