import { DataTypes } from 'sequelize';
import sequelize from '../../database.js';

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
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
  phone: {
    type: DataTypes.STRING,
  },
  profile_image: {
    type: DataTypes.TEXT,
  },
  name: {
    type: DataTypes.STRING,
  },
  resign_at: {
    type: DataTypes.DATE,
  },
  access_at: {
    type: DataTypes.DATE,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
  },
  refresh_token: {
    type: DataTypes.TEXT,
  },
}, {
  tableName: 'users',
  timestamps: false,
  underscored: true,
});

export default User;
