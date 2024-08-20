import express from 'express';
import Vote from '../models/vote.js';
import Candidate from '../models/Candidates.js';
import Voted from '../models/voted.js'; // Voted 모델 가져오기
import Location from "../models/Location.js";
import FavoriteList from '../models/FavoriteList.js';
import sequelize from '../../database.js';

const router = express.Router();

// 후보지에 투표하는 API (Vote DB에 저장)
router.post('/candidates/vote', async (req, res) => {
  const { can_id, user_id, state, skip, can_name, travel_id } = req.body;

  try {
    // 후보지 찾기
    const candidate = await Candidate.findOne({
      where: { can_name: can_name, travel_id: travel_id }
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found with the specified can_name and travel_id.' });
    }

    // 투표 데이터 Vote DB에 저장
    const [vote, created] = await Vote.findOrCreate({
      where: { travel_id, can_name, user_id, can_id },
      defaults: { state, skip }
    });

    if (!created) {
      vote.state = state;
      vote.skip = skip;
      await vote.save();
    }

    // 투표가 완료되었고 skip이 true이면 해당 can_name으로 묶인 모든 후보지에 대해 rank를 1로 설정
    if (skip) {
      const candidates = await Candidate.findAll({
        where: { can_name: can_name, travel_id: travel_id }
      });

      for (const candidate of candidates) {
        await Voted.create({
          can_id: candidate.can_id,
          location_id: candidate.location_id || null,
          travel_id: travel_id,
          user_id: user_id,
          favorit_id: candidate.favorit_id || null,
          ranked: 1 // skip이 true면 ranked를 1로 설정
        });
      }

      return res.status(201).json({ message: 'All candidates under the same can_name ranked as 1.' });
    }

    res.status(201).json(vote);
  } catch (error) {
    console.error('Error during voting:', error);
    res.status(500).json({ error: 'An error occurred while voting' });
  }
});

router.post('/candidates/vote-complete', async (req, res) => {
  const { user_id, can_id, can_name, travel_id, skip } = req.body;

  try {
    // 투표 항목의 vote_count 증가 (skip이 false일 때만)
    if (!skip) {
      const vote = await Vote.findOne({
        where: { can_id: can_id, can_name: can_name, travel_id: travel_id }
      });

      if (vote) {
        vote.vote_count += 1;
        await vote.save();
      }
    }

    // Candidate 테이블에서 해당 후보지 정보 가져오기
    const candidate = await Candidate.findOne({
      where: { can_id: can_id }
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found with the specified can_id.' });
    }

    // Candidate에서 장소 정보 가져오기
    let place_name, place_address;

    // location_id가 있는 경우 Location 테이블에서 정보를 가져옴
    if (candidate.location_id) {
      const location = await Location.findOne({ where: { location_id: candidate.location_id } });
      if (location) {
        place_name = location.location_name;
        place_address = location.location_address;
      }
    }
    // favorit_id가 있는 경우 FavoriteList 테이블에서 정보를 가져옴
    else if (candidate.favorit_id) {
      const favorite = await FavoriteList.findOne({ where: { favorit_id: candidate.favorit_id } });
      if (favorite) {
        place_name = favorite.place_name;
        place_address = favorite.address;
      }
    }

    // Voted 테이블에서 이미 존재하는지 확인
    const existingVoted = await Voted.findOne({
      where: { can_id: can_id, travel_id: travel_id, can_name: can_name }
    });

    if (existingVoted) {
      // 기존 기록이 있으면 ranked 값을 업데이트
      existingVoted.ranked = skip ? 1 : 0; // skip이 true면 ranked를 1로 설정
      existingVoted.place_name = place_name || null;
      existingVoted.place_address = place_address || null;
      await existingVoted.save();
    } else {
      // 투표 결과를 Voted 테이블에 새로 저장
      await Voted.create({
        can_id: can_id,
        can_name: can_name,
        location_id: candidate.location_id || null,
        travel_id: travel_id,
        user_id: user_id,
        favorit_id: candidate.favorit_id || null,
        ranked: skip ? 1 : 0, // skip이 true면 ranked를 1로 설정, 아니면 0
        place_name: place_name || null,
        place_address: place_address || null
      });
    }

    // 성공 메시지 반환
    res.status(201).json({ message: 'Vote completed and ranks updated successfully.' });
  } catch (error) {
    console.error('Error completing vote:', error);
    res.status(500).json({ error: 'An error occurred while completing the vote' });
  }
});


router.get('/candidates/vote-results/:travel_id', async (req, res) => {
  const { travel_id } = req.params;

  try {
    // 모든 후보지의 투표 수 가져오기
    const allVotes = await Vote.findAll({
      where: { travel_id: travel_id },
      attributes: [
        'can_name',
        [sequelize.fn('SUM', sequelize.col('vote_count')), 'total_vote_count'],
        'can_id'
      ],
      group: ['can_name', 'can_id'],
      order: [['can_name', 'ASC'], [sequelize.literal('total_vote_count'), 'DESC']],
      raw: true
    });

    if (allVotes.length === 0) {
      return res.status(404).json({ message: 'No vote results found for this travel plan.' });
    }

    // 각 can_name 그룹별로 ranked를 계산 및 Voted 테이블에 업데이트
    let currentCanName = null;
    let rank = 1;

    for (let i = 0; i < allVotes.length; i++) {
      const candidate = await Candidate.findOne({ where: { can_id: allVotes[i].can_id, travel_id: travel_id } });

      if (candidate) {
        // can_name이 바뀌면 rank를 1로 초기화
        if (allVotes[i].can_name !== currentCanName) {
          currentCanName = allVotes[i].can_name;
          rank = 1;
        }

        // Voted 테이블에서 동일한 can_name과 can_id를 가진 행을 업데이트
        await Voted.update(
          {
            ranked: rank // 투표 수가 많은 순서대로 rank를 설정
          },
          {
            where: {
              can_id: candidate.can_id,
              can_name: candidate.can_name,
              travel_id: travel_id
            }
          }
        );

        rank++; // 다음 순위로 증가
      }
    }

    // 최신 투표 결과 반환 (Voted 테이블에서 가져옴)
    const voteResults = await Voted.findAll({
      where: {
        travel_id
      },
      order: [['can_name', 'ASC'], ['ranked', 'ASC']], // can_name과 ranked 순서대로 정렬
      attributes: [
        'can_name',
        'ranked',
        'place_name',
        'place_address',
        'location_id',
        'favorit_id'
      ]
    });

    res.status(200).json(voteResults);
  } catch (error) {
    console.error('Error fetching vote results:', error);
    res.status(500).json({ error: 'An error occurred while fetching the vote results' });
  }
});


export default router;

