import { DataTypes } from 'sequelize';
import sequelize from '../../database.js';
import Candidate from './Candidates.js';
import User from './user.js';
import TravelPlan from './travelPlan.js'; // TravelPlan 모델을 임포트합니다.
const Vote = sequelize.define('Vote', {
  vote_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  can_id: { // candidate_id를 can_id로 변경
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Candidate,
      key: 'can_id'
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
  vote_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0 // 투표 수의 기본값을 0으로 설정
  },
  travel_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: TravelPlan, // TravelPlan 모델과 연관
      key: 'travel_id'
    }
  },
  can_name: {
    type: DataTypes.STRING,
    allowNull: false // 후보지 이름은 반드시 존재해야 하므로 not null로 설정
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


Vote.belongsTo(Candidate, { foreignKey: 'can_id' }); // foreignKey도 can_id로 변경
Vote.belongsTo(User, { foreignKey: 'user_id' });
Vote.belongsTo(TravelPlan, { foreignKey: 'travel_id' }); // travel_id를 TravelPlan 모델과 연관

export default Vote;