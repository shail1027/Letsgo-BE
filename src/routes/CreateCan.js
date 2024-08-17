import express from 'express';
import Candidate from '../models/Candidates.js';
import Location from '../models/Location.js';
import FavoriteList from '../models/FavoriteList.js';

const router = express.Router();

// 새로운 후보지를 생성하는 API
router.post('/candidates/new', async (req, res) => {
  const { travel_id } = req.params;
  const { location_id, favorit_id } = req.body;

  try {
    // Location 또는 FavoriteList에서 데이터 찾기
    let location;
    if (location_id) {
      location = await Location.findOne({ where: { location_id } });
    } else if (favorit_id) {
      location = await FavoriteList.findOne({ where: { favorit_id } });
    }

    if (!location) {
      return res.status(404).json({ error: 'Location or Favorite not found' });
    }

    const candidateName = location.location_name || location.place_name || 'Default Name';

    const candidate = await Candidate.create({
      can_name: candidateName,
      location_id: location.location_id || null,
      travel_id: travel_id,
      user_id: location.user_id || null,
      list_id: location.list_id || null
    });

    res.status(201).json({ message: 'Candidate created successfully', candidate });
  } catch (error) {
    console.error('Error creating candidate:', error);
    res.status(500).json({ error: 'An error occurred while creating the candidate' });
  }
});

export default router;