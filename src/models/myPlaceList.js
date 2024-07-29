import { DataTypes } from 'sequelize';
import sequelize from '../../database.js';
import User from './user.js';  // User 모델을 import

const MyPlaceList = sequelize.define('MyPlaceList', {
  list_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'user_id',
    },
  },
  location_url: {
    type: DataTypes.TEXT,
  },
  map_app: {
    type: DataTypes.TINYINT,
  },
  favorit_id: {
    type: DataTypes.INTEGER,
  },
  list_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'MyPlaceList',
  timestamps: false,
  underscored: true,
});

// 관계 정의
User.hasMany(MyPlaceList, { foreignKey: 'user_id' });
MyPlaceList.belongsTo(User, { foreignKey: 'user_id' });

export default MyPlaceList;
