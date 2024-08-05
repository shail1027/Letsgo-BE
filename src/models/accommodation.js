import { DataTypes } from 'sequelize';
import sequelize from '../../database.js';
import User from './user.js';
import TravelPlan from './travelPlan.js';

const Accommodation = sequelize.define('Accommodations', {
    acc_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  travel_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TravelPlan,
      key: 'travel_id'
    }
  },
  acc_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  acc_address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  check_in: {
    type: DataTypes.TIME,
    allowNull: true
  },
  check_out: {
    type: DataTypes.TIME,
    allowNull: true
  },
  acc_image: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'accommodations',
  timestamps: false,
  underscored: true,
});

User.hasMany(Accommodation, { foreignKey: 'user_id' });
Accommodation.belongsTo(User, { foreignKey: 'user_id' });

TravelPlan.hasMany(Accommodation, { foreignKey: 'travel_id' });
Accommodation.belongsTo(TravelPlan, { foreignKey: 'travel_id' });

export default Accommodation;