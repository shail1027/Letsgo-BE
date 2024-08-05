import express from 'express';
import Vote from '../models/vote.js';
import Candidate from '../src/models/candidate.js';

const router = express.Router();

// 후보지에 투표하는 API
router.post('/vote', async (req, res) => {
  const { candidate_id, user_id, state, skip } = req.body;

  try {
    // 후보지가 존재하는지 확인
    const candidate = await Candidate.findOne({ where: { candidate_id } });
    if (!candidate) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    // 사용자 투표 확인 및 업데이트
    const [vote, created] = await Vote.findOrCreate({
      where: { candidate_id, user_id },
      defaults: { state, skip }
    });

    if (!created) {
      vote.state = state;
      vote.skip = skip;
      await vote.save();
    }

    res.status(201).json(vote);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while voting' });
  }
});

// 특정 리스트의 후보지들에 대한 투표 결과 가져오는 API
router.get('/results/:list_id', async (req, res) => {
  const { list_id } = req.params;

  try {
    const results = await Candidate.findAll({
      where: { list_id },
      include: [
        {
          model: Vote,
          attributes: ['state', 'skip']
        }
      ]
    });

    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching results' });
  }
});

// 특정 리스트의 후보지들에 대한 투표 수를 가져오는 API
router.get('/vote-count/:list_id', async (req, res) => {
  const { list_id } = req.params;

  try {
    const voteCounts = await Vote.findAll({
      attributes: [
        'candidate_id',
        [sequelize.fn('COUNT', sequelize.col('vote_id')), 'vote_count']
      ],
      include: [
        {
          model: Candidate,
          attributes: [],
          where: { list_id }
        }
      ],
      group: ['candidate_id']
    });

    res.status(200).json(voteCounts);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching vote counts' });
  }
});

export default router;
