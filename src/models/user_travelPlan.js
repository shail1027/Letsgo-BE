import { DataTypes } from 'sequelize';
import sequelize from '../../database.js';
import User from './user.js';
import TravelPlan from './travelPlan.js';

const UserTravelPlan = sequelize.define('UserTravelPlan', {
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
  tableName: 'userTravelPlan',
  timestamps: true
});

User.belongsToMany(TravelPlan, { through: UserTravelPlan, foreignKey: 'user_id' });
TravelPlan.belongsToMany(User, { through: UserTravelPlan, foreignKey: 'travel_id' });

export default UserTravelPlan;
