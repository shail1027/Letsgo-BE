import { DataTypes } from 'sequelize';
import sequelize from '../../database.js';
import Accommodations from './accommodations.js';
import Voted from './voted.js';
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
    acc_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
        model: Accommodations,
        key: 'acc_id'
        }
    },
    location_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
        model: Location,
        key: 'location_id'
        }
    },


    route_title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    route_order: {
        type: DataTypes.INTEGER,    // STRING
        autoIncrement: true,
    }
}, {
    tableName: 'travelRoute',
    timestamps: false,
    underscored: true,
});

// 다대다 관계 테이블?
TravelPlan.belongsTo(TravelRoute, { foreignKey: 'travel_id' });
TravelRoute.hasMany(TravelPlan, { foreignKey: 'travel_id' });

Accommodations.belongsToMany(TravelRoute, { foreignKey: 'acc_id' });
TravelRoute.belongsToMany(Accommodations, { foreignKey: 'acc_id' });

Location.belongsToMany(TravelRoute, { foreignKey: 'location_id' });
TravelRoute.belongsToMany(Location, { foreignKey: 'location_id' });

export default TravelRoute;