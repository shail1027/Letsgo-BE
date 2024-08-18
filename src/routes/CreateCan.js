import express from 'express';
import { Sequelize } from 'sequelize';
import Candidate from '../models/Candidates.js';
import Location from '../models/Location.js';
import FavoriteList from '../models/FavoriteList.js';

const router = express.Router();

// 새로운 후보지를 생성하는 API
router.post('/candidates/new', async (req, res) => {
  const { travel_id, location_id, favorit_id, can_name } = req.body;

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
      travel_id: travel_id, // body에서 추출한 travel_id 사용
      user_id: location ? location.user_id : favorite.user_id, // location 또는 favorite에서 user_id 가져오기
      favorite_id: favorite ? favorite.favorit_id : null
    });

    res.status(201).json({ message: 'Candidate created successfully', candidate });
  } catch (error) {
    console.error('Error creating candidate:', error);
    res.status(500).json({ error: 'An error occurred while creating the candidate' });
  }
});

router.get('/candidates/by-travel', async (req, res) => {
  const { travel_id } = req.query;

  try {
    if (!travel_id) {
      return res.status(400).json({ error: 'travel_id is required' });
    }

    // travel_id에 해당하는 중복되지 않은 can_name 목록 조회
    const candidates = await Candidate.findAll({
      where: { travel_id },
      attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('can_name')), 'can_name']]
    });

    if (candidates.length === 0) {
      return res.status(404).json({ error: 'No candidates found for the provided travel_id' });
    }

    res.status(200).json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'An error occurred while fetching the candidates' });
  }
});

router.get('/candidates', async (req, res) => {
  const { can_name, travel_id } = req.query;

  try {
    if (!can_name || !travel_id) {
      return res.status(400).json({ error: 'can_name and travel_id are required' });
    }

    // can_name과 travel_id에 해당하는 후보지 리스트 조회
    const candidates = await Candidate.findAll({
      where: { can_name, travel_id },
      include: [
        {
          model: Location,
          attributes: ['location_name']
        },
        {
          model: FavoriteList,
          attributes: ['place_name']
        }
      ]
    });

    if (candidates.length === 0) {
      return res.status(404).json({ error: 'No candidates found with the provided criteria' });
    }

    res.status(200).json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'An error occurred while fetching the candidates' });
  }
});


export default router;
