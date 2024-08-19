import express from 'express';
import Vote from '../models/vote.js';
import Candidate from '../models/Candidates.js';
import Voted from '../models/voted.js'; // Voted 모델 가져오기

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

// 투표 완료 후 Voted DB에 저장하는 API
router.post('/candidates/vote-complete', async (req, res) => {
  const { user_id, can_id, travel_id, ranked } = req.body;

  try {
    // 후보지 정보를 can_id를 통해 조회
    const candidate = await Candidate.findOne({
      where: { can_id: can_id, travel_id: travel_id }
    });

    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found with the specified can_id and travel_id.' });
    }

    // 투표 결과를 Voted 테이블에 저장
    const voted = await Voted.create({
      can_id: candidate.can_id, // can_id로 후보지 식별
      location_id: candidate.location_id || null, // Candidate에서 location_id 가져옴
      travel_id: travel_id,
      user_id: user_id,
      favorit_id: candidate.favorit_id || null, // Candidate에서 favorit_id 가져옴
      ranked: ranked
    });

    res.status(201).json(voted);
  } catch (error) {
    console.error('Error completing vote:', error);
    res.status(500).json({ error: 'An error occurred while completing the vote' });
  }
});
// 투표 결과를 조회하는 API
router.get('/candidates/vote-results/:travel_id/:can_name', async (req, res) => {
  const { travel_id, can_name } = req.params;

  try {
    // 해당 여행 계획과 can_name에 대한 모든 투표 결과 조회
    const voteResults = await Voted.findAll({
      include: [{
        model: Candidate,
        where: { can_name: can_name }
      }],
      where: {
        travel_id
      }
    });

    if (voteResults.length === 0) {
      return res.status(404).json({ message: 'No vote results found for this travel plan and can_name.' });
    }

    res.status(200).json(voteResults);
  } catch (error) {
    console.error('Error fetching vote results:', error);
    res.status(500).json({ error: 'An error occurred while fetching the vote results' });
  }
});

export default router;
