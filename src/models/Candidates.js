import { DataTypes } from 'sequelize';
import sequelize from '../../database.js';
import MPLM from './MyPlaceListMapping.js';
import Location from './location.js';


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
      model: Location,
      key: 'location_id'
    }
  },
  travel_id: {
    type: DataTypes.INTEGER,
    references: {
      model: TravelPlan,
      key: 'travel_id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  list_id: {
    type: DataTypes.INTEGER,
    references: {
      model: List,
      key: 'id'
    }
  }
});

Candidate.belongsTo(MPLM, { foreignKey: 'list_id' });
Candidate.belongsTo(MPLM, { foreignKey: 'user_id' });
Candidate.belongsTo(Location, { foreignKey: 'travel_id' });
Candidate.belongsTo(Location, { foreignKey: 'user_id' });

export default Candidate;
