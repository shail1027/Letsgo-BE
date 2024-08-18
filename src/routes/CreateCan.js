import express from 'express';
import Candidate from '../models/Candidates.js';
import Location from '../models/Location.js';
import FavoriteList from '../models/FavoriteList.js';

const router = express.Router();

// 새로운 후보지를 생성하는 API
router.post('/candidates/new', async (req, res) => {
  const { travel_id } = req.params;
  const { location_id, favorit_id, can_name } = req.body;

  try {
    let location, favorite;
    let candidateName = can_name || '';

    // Location에서 데이터 찾기
    if (location_id) {
      location = await Location.findOne({ where: { location_id } });
      if (location && !candidateName) {
        candidateName += `Location: ${location.location_name}`;
      }
    }

    // FavoriteList에서 데이터 찾기
    if (favorit_id) {
      favorite = await FavoriteList.findOne({ where: { favorit_id } });
      if (favorite && !candidateName) {
        if (candidateName) {
          candidateName += ' & ';
        }
        candidateName += `Favorite: ${favorite.place_name}`;
      }
    }

    // Location 또는 FavoriteList에서 찾은 결과가 없으면 에러 반환
    if (!location && !favorite) {
      return res.status(404).json({ error: 'Location or Favorite not found' });
    }

    const candidate = await Candidate.create({
      can_name: candidateName,
      location_id: location ? location.location_id : null,
      travel_id: travel_id,
      user_id: location ? location.user_id : favorite.user_id, // location 또는 favorite에서 user_id 가져오기
      favorit_id: favorite ? favorite.favorit_id : null
    });

    res.status(201).json({ message: 'Candidate created successfully', candidate });
  } catch (error) {
    console.error('Error creating candidate:', error);
    res.status(500).json({ error: 'An error occurred while creating the candidate' });
  }
});

router.get('/candidates', async (req, res) => {
  const { can_name } = req.query;

  try {
    // can_name이 "후보지 1"인 후보지를 찾고, 관련된 Location 및 FavoriteList 데이터를 조인하여 가져옴
    const candidates = await Candidate.findAll({
      where: { can_name },
      include: [
        {
          model: Location,
          attributes: ['location_name'], // 필요한 필드만 선택
        },
        {
          model: FavoriteList,
          attributes: ['place_name'], // 필요한 필드만 선택
        },
      ],
    });

    if (candidates.length === 0) {
      return res.status(404).json({ error: 'No candidates found with the provided name' });
    }

    res.status(200).json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'An error occurred while fetching the candidates' });
  }
});

export default router;
