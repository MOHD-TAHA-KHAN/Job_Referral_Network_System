import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/db';

export interface ProjectInstance extends Model {
  id: string;
  userId: string;
  title: string;
  description?: string;
  startDate?: Date;
  endDate?: Date;
  githubUrl?: string;
  demoUrl?: string;
  skills?: string[];
  isFromGithub?: boolean;
}

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    field: 'user_id',
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 255]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  startDate: {
    type: DataTypes.DATE,
    field: 'start_date',
    allowNull: true,
  },
  endDate: {
    type: DataTypes.DATE,
    field: 'end_date',
    allowNull: true,
  },
  githubUrl: {
    type: DataTypes.STRING,
    field: 'github_url',
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  demoUrl: {
    type: DataTypes.STRING,
    field: 'demo_url',
    allowNull: true,
    validate: {
      isUrl: true
    }
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  isFromGithub: {
    type: DataTypes.BOOLEAN,
    field: 'is_from_github',
    defaultValue: false,
  },
}, {
  timestamps: true,
  tableName: 'projects',
  indexes: [
    {
      fields: ['user_id'],
    },
  ],
});

(Project as any).associate = (models: any) => {
  Project.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user',
  });
};

export default Project;
