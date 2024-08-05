import { DataTypes } from 'sequelize';
import sequelize from '../../database.js';
import Candidate from './candidate.js';
import User from './user.js';

const Vote = sequelize.define('Vote', {
  vote_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  candidate_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Candidate,
      key: 'candidate_id'
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'user_id'
    }
  },
  state: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  skip: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

Vote.belongsTo(Candidate, { foreignKey: 'candidate_id' });
Vote.belongsTo(User, { foreignKey: 'user_id' });

export default Vote;
