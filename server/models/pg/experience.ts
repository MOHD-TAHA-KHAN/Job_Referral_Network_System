import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../config/db';

export interface ExperienceInstance extends Model {
  id: string;
  userId: string;
  title: string;
  company: string;
  location?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent?: boolean;
  description?: string;
  skills?: string[];
}

const Experience = sequelize.define('Experience', {
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
  company: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [2, 255]
    }
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  startDate: {
    type: DataTypes.DATE,
    field: 'start_date',
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    field: 'end_date',
    allowNull: true,
  },
  isCurrent: {
    type: DataTypes.BOOLEAN,
    field: 'is_current',
    defaultValue: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
}, {
  timestamps: true,
  tableName: 'experiences',
  indexes: [
    {
      fields: ['user_id'],
    },
  ],
});

(Experience as any).associate = (models: any) => {
  Experience.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user',
  });
};

export default Experience;
