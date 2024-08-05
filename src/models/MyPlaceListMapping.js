import { DataTypes } from 'sequelize';
import sequelize from '../../database.js';

const MyPlaceListMapping = sequelize.define('MyPlaceListMapping', {
  mapping_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  list_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'myPlaceList',
      key: 'list_id',
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'users', // 'User' 모델이 사용하는 테이블 이름과 일치해야 합니다.
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

export default MyPlaceListMapping;
