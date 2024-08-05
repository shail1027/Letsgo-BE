import { DataTypes } from 'sequelize';
import sequelize from '../../database.js';

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
      model: 'locations',
      key: 'location_id'
    }
  },
  travel_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'travelPlan', // Travel 모델을 올바르게 참조해야 합니다.
      key: 'travel_id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users', // User 모델을 올바르게 참조해야 합니다.
      key: 'user_id'
    }
  },
  list_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'MyPlaceListMapping',
      key: 'list_id'
    }
  }
}, {
  tableName: 'candidates',
  timestamps: false
});

export default Candidate;
