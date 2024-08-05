import { DataTypes } from 'sequelize';
import sequelize from '../../database.js';
import MPLM from './MyPlaceListMapping.js';


const Location = sequelize.define('Location', {
  location_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  travel_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      allowNull: false
    }
  },
  location_name: {
    type: DataTypes.STRING,
  },
  location_adress: {
    type: DataTypes.STRING,
  },
  list_id: {
    type: DataTypes.INTEGER,
    references: {
        autoIncrement: true,
    }
  }
});

Candidate.belongsTo(MPLM, { foreignKey: 'list_id' });
Candidate.belongsTo(MPLM, { foreignKey: 'user_id' });

export default Location;
