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

// 투표 완료 후 Vote DB에서 vote_count 증가시키는 API
router.post('/candidates/vote-complete', async (req, res) => {
  const { user_id, can_id, can_name, travel_id } = req.body;

  try {
    // 투표 완료한 항목의 vote_count 증가
    const vote = await Vote.findOne({
      where: { can_name: can_name, can_id: can_id, travel_id: travel_id }
    });

    if (!vote) {
      return res.status(404).json({ error: 'Vote record not found with the specified can_name, can_id, and travel_id.' });
    }

    // vote_count 증가
    vote.vote_count += 1;
    await vote.save();

    res.status(201).json({ message: 'Vote count incremented successfully.' });
  } catch (error) {
    console.error('Error completing vote:', error);
    res.status(500).json({ error: 'An error occurred while completing the vote' });
  }
});

// 투표 결과를 조회하고 Voted DB에 ranked를 저장하는 API
router.get('/candidates/vote-results/:travel_id/:can_name', async (req, res) => {
  const { travel_id, can_name } = req.params;

  try {
    // 모든 후보지의 투표 수 가져오기
    const allVotes = await Vote.findAll({
      where: { can_name: can_name, travel_id: travel_id },
      order: [['vote_count', 'DESC']]
    });

    if (allVotes.length === 0) {
      return res.status(404).json({ message: 'No vote results found for this travel plan and can_name.' });
    }

    // 투표 수를 기반으로 ranked 계산 및 Voted 테이블에 저장
    for (let i = 0; i < allVotes.length; i++) {
      const candidate = await Candidate.findOne({ where: { can_id: allVotes[i].can_id, travel_id: travel_id } });

      if (candidate) {
        await Voted.upsert({
          can_id: candidate.can_id,
          location_id: candidate.location_id || null,
          travel_id: travel_id,
          user_id: allVotes[i].user_id, // 투표한 사용자 정보 저장
          favorit_id: candidate.favorit_id || null,
          ranked: i + 1 // 투표 수가 많은 순서대로 rank를 설정
        });
      }
    }

    // 최신 투표 결과 반환 (Voted 테이블에서 가져옴)
    const voteResults = await Voted.findAll({
      where: {
        travel_id
      }
    });

    res.status(200).json(voteResults);
  } catch (error) {
    console.error('Error fetching vote results:', error);
    res.status(500).json({ error: 'An error occurred while fetching the vote results' });
  }
});

export default router;
