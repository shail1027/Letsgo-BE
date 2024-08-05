import MyPlaceListMapping from './MyPlaceListMapping.js';
import Location from './location.js';
import Candidate from './Candidates.js';
import User from './user.js';
import MyPlaceList from './myPlaceList.js';

// 관계 정의
MyPlaceList.hasMany(MyPlaceListMapping, { foreignKey: 'list_id' });
MyPlaceListMapping.belongsTo(MyPlaceList, { foreignKey: 'list_id' });

User.hasMany(MyPlaceListMapping, { foreignKey: 'user_id' });
MyPlaceListMapping.belongsTo(User, { foreignKey: 'user_id' });

MyPlaceListMapping.hasMany(Candidate, { foreignKey: 'list_id' });
Candidate.belongsTo(MyPlaceListMapping, { foreignKey: 'list_id' });
Candidate.belongsTo(User, { foreignKey: 'user_id' });
Candidate.belongsTo(Location, { foreignKey: 'location_id' });

Location.belongsTo(MyPlaceListMapping, { foreignKey: 'list_id' });
Location.belongsTo(MyPlaceListMapping, { foreignKey: 'user_id' });

MyPlaceListMapping.hasMany(Location, { foreignKey: 'list_id' });
MyPlaceListMapping.hasMany(Location, { foreignKey: 'user_id' });
