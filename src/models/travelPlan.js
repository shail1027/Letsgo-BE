import { Sequelize, DataTypes } from 'sequelize';
import sequelize from '../../database.js';
import User from '../models/user.js'; // User 모델을 임포트합니다.

const TravelPlan = sequelize.define('TravelPlan', {
  travel_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  region: {
    type: DataTypes.STRING,
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  status: {
    type: DataTypes.TINYINT,
    allowNull: false
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  update_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.NOW
  },
  explain: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  start_time: {
    type: DataTypes.TIME,
    allowNull: true
  },
  end_time: {
    type: DataTypes.TIME,
    allowNull: true
  }
}, {
  tableName: 'TravelPlan',
  timestamps: false
});

// 모델 간의 관계를 설정합니다.
User.hasMany(TravelPlan, {
  foreignKey: 'user_id'
});
TravelPlan.belongsTo(User, {
  foreignKey: 'user_id'
});


export default TravelPlan;
