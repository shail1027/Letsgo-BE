import express from 'express';
import TravelRoute from '../models/travelRoute.js';
import Voted from '../models/voted.js';

const router = express.Router();

// 동선을 등록하는 API
router.post('/travel-plans/add-route', async (req, res) => {
  const { travel_id, accommodations, routes } = req.body;

  try {
    const travelRoutes = [];

    // 숙소 정보를 동선에 추가
    if (accommodations && accommodations.length > 0) {
      for (const accommodation of accommodations) {
        travelRoutes.push({
          travel_id,
          name: accommodation.name,
          location: accommodation.location,
          type: 'accommodation',
          ranked: null,
          location_id: null,
        });
      }
    }

    // 투표 결과 기반으로 동선에 추가
    if (routes && routes.length > 0) {
      for (const route of routes) {
        const votedLocation = await Voted.findOne({
          where: {
            travel_id,
            location_id: route.location_id,
            ranked: route.ranked,
          },
        });

        if (votedLocation) {
          travelRoutes.push({
            travel_id,
            name: null,
            location: votedLocation.location_id,
            type: 'location',
            ranked: route.ranked,
            location_id: route.location_id,
          });
        } else {
          return res.status(404).json({ error: `Location with id ${route.location_id} and rank ${route.ranked} not found in voted results.` });
        }
      }
    }

    // 동선을 TravelRoute 테이블에 저장
    const savedRoutes = await TravelRoute.bulkCreate(travelRoutes);

    res.status(201).json({
      message: "Travel route added successfully",
      routes: savedRoutes,
    });
  } catch (error) {
    console.error('Error adding travel route:', error);
    res.status(500).json({ error: 'An error occurred while adding the travel route' });
  }
});

export default router;