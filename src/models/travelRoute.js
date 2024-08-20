import { DataTypes } from 'sequelize';
import sequelize from '../../database.js';
import Accommodations from './accommodation.js';
import Location from './Location.js'; // Location 모델 import
import TravelPlan from './travelPlan.js';

const TravelRoute = sequelize.define('TravelRoute', {
  route_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  travel_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TravelPlan,
      key: 'travel_id'
    }
  },
  acc_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Accommodation이 없을 수도 있으므로 null을 허용합니다.
    references: {
      model: Accommodations,
      key: 'acc_id'
    }
  },
  place_name: {
    type: DataTypes.STRING,
    allowNull: true // 투표 결과에서 가져온 장소 이름을 저장합니다.
  },
  place_address: {
    type: DataTypes.STRING,
    allowNull: true // 투표 결과에서 가져온 장소 주소를 저장합니다.
  },
  route_title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  route_order: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'travelRoute',
  timestamps: false,
  underscored: true,
});

// 모델 간의 관계를 설정합니다.
TravelPlan.hasMany(TravelRoute, { foreignKey: 'travel_id' });
TravelRoute.belongsTo(TravelPlan, { foreignKey: 'travel_id' });

Accommodations.hasMany(TravelRoute, { foreignKey: 'acc_id' });
TravelRoute.belongsTo(Accommodations, { foreignKey: 'acc_id' });

// Location.hasMany(TravelRoute, { foreignKey: 'location_id' });
// TravelRoute.belongsTo(Location, { foreignKey: 'location_id' });

export default TravelRoute;
