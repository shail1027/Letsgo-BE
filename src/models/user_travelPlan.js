import { DataTypes } from 'sequelize';
import sequelize from '../../database.js';

import User from './user.js';
import TravelPlan from './travelPlan.js';

const UserTravelPan = sequelize.define('UserTravelPan', {
  // 기획자
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  travel_id: {
    type: DataTypes.INTEGER,
    references: {
      model: TravelPlan,
      key: 'travel_id'
    }
  }
}, {
    tableName: 'userTravel',
    timestamps: true
});

User.belongsToMany(TravelPlan, { through: UserTravelPan, foreignKey: 'user_id' });
TravelPlan.belongsToMany(User, { through: UserTravelPan, foreignKey: 'travel_id' });

module.exports = UserTravelPan;
