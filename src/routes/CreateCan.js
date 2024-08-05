import express from 'express';
import Candidate from '../models/candidate.js';
import Location from '../models/location.js';

const router = express.Router();

// 장소를 후보군 리스트에 추가하는 API
router.post('/add', async (req, res) => {
  const { location_id, list_id, user_id, travel_id } = req.body;

  try {
    // Location 정보 가져오기
    const location = await Location.findOne({ where: { location_id } });
    if (!location) {
      return res.status(404).json({ error: 'Location not found' });
    }

    // 후보군 리스트에 추가
    const candidate = await Candidate.create({
      location_id,
      list_id,
      user_id,
      travel_id,
      location_name: location.location_name,
      location_address: location.location_address
    });

    res.status(201).json(candidate);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding to the candidate list' });
  }
});

export default router;
