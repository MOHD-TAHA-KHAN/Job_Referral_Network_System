import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/db';

export interface UserInstance extends Model {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'FRESHER' | 'PROFESSIONAL' | 'HR';
  company?: string;
  domain?: string;
  skills?: string[];
  resumeUrl?: string;
  referralSuccessRate?: number;
  isActive?: boolean;
  lastLogin?: Date;
  profileCompleted?: boolean;
}

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 255]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  role: {
    type: DataTypes.ENUM('FRESHER', 'PROFESSIONAL', 'HR'),
    defaultValue: 'FRESHER',
    allowNull: false
  },
  company: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [2, 255]
    }
  },
  domain: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      len: [2, 100]
    }
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  resumeUrl: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  referralSuccessRate: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  },
  profileCompleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['role']
    },
    {
      fields: ['domain']
    },
    {
      fields: ['company']
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['skills'],
      using: 'gin'
    }
  ]
});

// Define associations
(User as any).associate = (models: any) => {
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

export default User;