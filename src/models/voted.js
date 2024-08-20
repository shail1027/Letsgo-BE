import { DataTypes } from 'sequelize';
import sequelize from '../../database.js';
import Location from './Location.js';
import FavoritList from './FavoriteList.js';


const Voted = sequelize.define('Voted', {
    vote_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
  can_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  location_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Location,
      key: 'location_id'
    },
    allowNull: true
  },
  can_name: {
    type: DataTypes.STRING,
    allowNull: false // 후보지 이름은 반드시 존재해야 하므로 not null로 설정
  },
  travel_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  favorit_id: {
    type: DataTypes.INTEGER,
    references: {
      model: FavoritList,
      key: 'favorit_id'
    },
    allowNull: true
  },
  place_name: {  // 새로 추가된 필드
    type: DataTypes.STRING,
    allowNull: true,
  },
  place_address: {  // 새로 추가된 필드
    type: DataTypes.STRING,
    allowNull: true,
  },
  ranked: {
    type: DataTypes.INTEGER,
  }
},  {
    freezeTableName: true,// 테이블 이름을 고정
    timestamps: false
  });


Voted.belongsTo(Location, { foreignKey: 'location_id' });
Voted.belongsTo(FavoritList, { foreignKey: 'favorit_id' });

export default Voted;