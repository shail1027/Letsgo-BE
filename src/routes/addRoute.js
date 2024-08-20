import express from 'express';
import TravelRoute from '../models/travelRoute.js';
import Voted from '../models/voted.js';
import Accommodation from '../models/accommodation.js'; // Accommodation 모델 import

const router = express.Router();

// 동선을 등록하는 API
router.post('/travel-plans/add-route', async (req, res) => {
  const { travel_id, route_title, routes } = req.body;

  try {
    const travelRoutes = [];

    // 각 route에 대해 처리
    for (const route of routes) {
      let place_name = null;
      let place_address = null;

      // can_id와 can_name이 있을 때 Voted 테이블에서 가져옴
      if (route.can_id && route.can_name) {
        const votedLocation = await Voted.findOne({
          where: {
            travel_id: travel_id,
            can_id: route.can_id,
            can_name: route.can_name
          }
        });

        if (votedLocation) {
          place_name = votedLocation.place_name;
          place_address = votedLocation.place_address;
        } else {
          return res.status(404).json({ error: `Voted location not found with can_id ${route.can_id} and can_name ${route.can_name}.` });
        }
      }

      // acc_id가 있을 때 Accommodation 테이블에서 가져옴
      else if (route.acc_id) {
        const accommodation = await Accommodation.findOne({
          where: { acc_id: route.acc_id }
        });

        if (accommodation) {
          place_name = accommodation.acc_name;
          place_address = accommodation.acc_address;
        } else {
          return res.status(404).json({ error: `Accommodation not found with acc_id ${route.acc_id}.` });
        }
      }

      // TravelRoute 테이블에 추가
      travelRoutes.push({
        travel_id: travel_id,
        route_title: route_title,
        route_order: route.route_order,
        place_name: place_name,
        place_address: place_address,
        acc_id: route.acc_id || null,
        location_id: route.can_id || null,
      });
    }

    // 중복된 route_order 확인
    const existingRoutes = await TravelRoute.findAll({
      where: { travel_id: travel_id, route_title: route_title }
    });

    const existingOrders = existingRoutes.map(route => route.route_order);
    const newOrders = travelRoutes.map(route => route.route_order);

    const duplicateOrders = newOrders.filter(order => existingOrders.includes(order));
    if (duplicateOrders.length > 0) {
      return res.status(400).json({ error: `Duplicate route_order found: ${duplicateOrders.join(', ')}` });
    }

    // 동선을 TravelRoute 테이블에 저장
    const savedRoutes = await TravelRoute.bulkCreate(travelRoutes);

    // 저장된 동선 중 route_title 아래에 있는 route_order 반환
    const routeResults = await TravelRoute.findAll({
      where: { travel_id: travel_id, route_title: route_title },
      order: [['route_order', 'ASC']]
    });

    res.status(201).json({
      message: "Travel route added successfully",
      routes: routeResults,
    });
  } catch (error) {
    console.error('Error adding travel route:', error);
    res.status(500).json({ error: 'An error occurred while adding the travel route' });
  }
});

export default router;
