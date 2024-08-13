import { DataTypes } from 'sequelize';
import sequelize from '../../database.js';
import User from './user.js';
import TravelPlan from './travelPlan.js';

const FavoriteList = sequelize.define('FavoriteList', {
  favorit_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users', // refers to table name
      key: 'user_id', // refers to column name in referenced table
    }
  },
  travel_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'TravelPlan', // refers to table name
      key: 'travel_id', // refers to column name in referenced table
    }
  },
  list_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  place_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'favoritelist',
  timestamps: false,
  underscored: true,
});

User.hasMany(FavoriteList, { foreignKey: 'user_id' });
FavoriteList.belongsTo(User, { foreignKey: 'user_id' });

TravelPlan.hasMany(FavoriteList, { foreignKey: 'travel_id' });
FavoriteList.belongsTo(TravelPlan, { foreignKey: 'travel_id' });

export default FavoriteList;
