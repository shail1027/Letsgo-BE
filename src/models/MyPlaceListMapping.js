import { DataTypes } from 'sequelize';
import sequelize from '../../database.js';
import User from './user.js';
import MyPlaceList from './myPlaceList.js';  // MyPlaceList 모델 import
import Candidate from "./Candidates.js"; // Candidate 모델 import

// MyPlaceListMapping 모델 정의
const MyPlaceListMapping = sequelize.define('MyPlaceListMapping', {
  mapping_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  list_id: {
    type: DataTypes.INTEGER,
    references: {
      model: MyPlaceList,
      key: 'list_id',
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'user_id',
    },
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
  tableName: 'MyPlaceListMapping',
  timestamps: false,
  underscored: true,
});

// 관계 정의
MyPlaceList.hasMany(MyPlaceListMapping, { foreignKey: 'list_id' });
MyPlaceListMapping.belongsTo(MyPlaceList, { foreignKey: 'list_id' });

User.hasMany(MyPlaceListMapping, { foreignKey: 'user_id' });
MyPlaceListMapping.belongsTo(User, { foreignKey: 'user_id' });

MyPlaceListMapping.belongsTo(Candidate, { foreignKey: 'list_id' });
MyPlaceListMapping.belongsTo(Candidate, { foreignKey: 'user_id' });

export default MyPlaceListMapping;
