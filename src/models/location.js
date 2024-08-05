import { DataTypes } from 'sequelize';
import sequelize from '../../database.js';
import User from './user.js';
import TravelPlan from './travelPlan.js';

const Location = sequelize.define('Location', {
  location_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  travel_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TravelPlan,
      key: 'travel_id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  location_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location_address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location_img: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'Location',
  timestamps: false
});

// 모델 간의 관계를 설정합니다.
TravelPlan.hasMany(Location, {
  foreignKey: 'travel_id'
});
Location.belongsTo(TravelPlan, {
  foreignKey: 'travel_id'
});

User.hasMany(Location, {
  foreignKey: 'user_id'
});
Location.belongsTo(User, {
  foreignKey: 'user_id'
});

export default Location;