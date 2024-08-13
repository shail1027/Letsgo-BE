import { DataTypes } from 'sequelize';
import sequelize from '../../database.js';
import MPLM from './MyPlaceListMapping.js';  // MyPlaceListMapping 모델을 불러옵니다.
import Location from './Location.js';         // Location 모델을 불러옵니다.
import TravelPlan from './travelPlan.js';     // TravelPlan 모델을 불러옵니다.
import User from './user.js';                 // User 모델을 불러옵니다.

const Candidate = sequelize.define('Candidate', {
  can_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  can_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Location,  // Location 모델을 참조합니다.
      key: 'location_id'
    }
  },
  travel_id: {
    type: DataTypes.INTEGER,
    references: {
      model: TravelPlan,  // TravelPlan 모델을 참조합니다.
      key: 'travel_id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,  // User 모델을 참조합니다.
      key: 'user_id'
    }
  },
  list_id: {
    type: DataTypes.INTEGER,
    references: {
      model: MPLM,  // MyPlaceListMapping 모델을 참조합니다.
      key: 'list_id'
    }
  }
}, {
  tableName: 'candidates',
  timestamps: false
});

export default Candidate;