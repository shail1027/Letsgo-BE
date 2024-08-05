import { DataTypes } from 'sequelize';
import sequelize from '../database.js';
import Candidate from "./Candidates.js";


const MyPlaceListMapping = sequelize.define('MyPlaceListMapping', {
  list_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  mapping_id: {
    type: DataTypes.INTEGER,
    references: {
        autoIncrement: true,
    }
  },
  place_name: {
    type: DataTypes.STRING,
    references: {
        allowNull: false
    }
  },
  adress: {
    type: DataTypes.STRING,
    references: {
        allowNull: false
    }
  }
});

MyPlaceListMapping.belongsTo(Candidate, { foreignKey: 'list_id' });
MyPlaceListMapping.belongsTo(Candidate, { foreignKey: 'user_id' });

export default MyPlaceListMapping;
