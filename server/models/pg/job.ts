import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/db';

export interface JobInstance extends Model {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  requiredSkills: string[];
  domain: string;
  salaryMin?: number;
  salaryMax?: number;
  experienceLevel: 'ENTRY' | 'MID' | 'SENIOR' | 'LEAD';
  jobType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE';
  isActive: boolean;
  applicationCount: number;
  viewCount: number;
  expiresAt?: Date;
  createdBy: string;
  creator?: any; // For associations
}

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5, 255]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [20, 5000]
    }
  },
  company: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 255]
    }
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 255]
    }
  },
  requiredSkills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    allowNull: false
  },
  domain: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  salaryMin: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 10000000
    }
  },
  salaryMax: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 10000000
    }
  },
  experienceLevel: {
    type: DataTypes.ENUM('ENTRY', 'MID', 'SENIOR', 'LEAD'),
    defaultValue: 'ENTRY',
    allowNull: false
  },
  jobType: {
    type: DataTypes.ENUM('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'REMOTE'),
    defaultValue: 'FULL_TIME',
    allowNull: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  applicationCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  createdBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Users',
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
    },
    {
      fields: ['isActive']
    },
    {
      fields: ['experienceLevel']
    },
    {
      fields: ['jobType']
    },
    {
      fields: ['salaryMin', 'salaryMax']
    },
    {
      fields: ['expiresAt']
    },
    {
      fields: ['requiredSkills'],
      using: 'gin'
    },
    {
      fields: ['createdAt']
    }
  ]
});

// Define associations
(Job as any).associate = (models: any) => {
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

export default Job;