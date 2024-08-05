import jwt from 'jsonwebtoken';

import User_TravelPlan from '../models/user_travelPlan.js';
import TravelPlan from '../models/travelPlan.js';
import Accommodation from '../models/accommodation.js';
import Location from '../models/location.js';
import TravelRoute from '../models/travelRoute.js';

import { TravelPlanDto, TravelPlanListDto, AccomodationsDTO, TravelRouteDTO } from '../dtos/travelPlansDto.js';

// 내가 참여한 여행 목록 조회
export const getMyTravelList = async (req, res) => {
    const userId = req.body.user_id;

    try {
        const myTravels = await User_TravelPlan.findAll({ where: { travel_id: travelId } });
        const myTravelLists = myTravels.map(travel => new TravelPlanListDto(travel.travel_id, travel.title, travel.region, travel.start_date, travel.end_date, travel.status));
        res.json(myTravelLists);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// 여행계획방 생성
export const createTravelPlan = async (req, res) => {
    try {
        const info = { image, title, description, start_date, end_date, start_time, end_time, region };  
        const travelPlan = await TravelPlan.create(info => new TravelPlanDto(req.body.image, req.body.title, req.body.description, req.body.start_date, req.body.end_date, req.body.start_time, req.body.end_time, req.body.region));
        res.status(201).json({ message: 'TravelPlan created successfully', travelPlan });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }  
};

// 여행계획방 수정( 여행 사진 등록, 여행 지역 선택)
export const updateTravelPlan = async (req, res) => {
    const travelImage = req.file ? `/uploads/${req.file.filename}` : null;
    const { region } = req.body;

    try {
        const travelPlan = req.travelPlan;

        if (!travelPlan) {
            return res.status(404).json({ error: 'TravelPlan not found' });
        }

        travelPlan.region = region;

        if (travelImage) {
            travelPlan.travel_image = travelImage; // 여행 이미지 URL로 업데이트
        }

        await travelPlan.save();

        res.status(200).json({
            message: 'TravelPlan information updated successfully',
            travelPlan: {
            ...travelPlan.toJSON(),
            travel_image: travelPlan.travel_image // travel_image에 URL 저장
            }
        });
    } catch (error) {
    console.error('Update TravelPlan Info Error:', error);
    res.status(500).json({ error: error.message });
    }
};

// 숙소 검색
export const getAccomodations = async (req, res) => {
    const { url, acc_id } = req.body;
    
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const placeName = $('div.LylZZ span.GHAhO').text();
        const address = $('div.vV_z_ a.PkgBl span.LDgIH').text(); 
        if (!address) {
            console.log('Address not found:', address);
            return res.status(404).send({ error: 'Address not found' });
        }
        const imageUrl = $('a.place_thumb img.K0PDV').attr('src');

        const newAccomodation = await Accomodation.create({
            travel_id,
            user_id,
            acc_name: placeName,
            acc_address: address,  
            acc_img: imageUrl
        });

        res.status(200).send(newAccomodation);
    } catch (error) {
        console.error('Error fetching the place info or saving to DB:', error);
        res.status(500).send({ error: 'Error fetching place information' });
    }
};

// 숙소 등록
export const addAccomodations = async (req, res) => {

};

// 등록된 숙소 목록 조회 
export const getMyAcc = async (req, res) => {
    const { acc_id } = req.query;

    let query = {};
    if (acc_id) {
        query = { where: { acc_id } };
    }

    try {
        const accommodations = await Accommodation.findAll(query);

        res.status(200).send(accommodations);
    } catch (error) {
        console.error('Error fetching accommodations:', error);
        res.status(500).send({ error: 'Error fetching accommodations' });
    }
};

// 여행계획방 (안내) 조회
export const getTravelPlan = async (req, res) => {
    const travelId = req.travelPlan.travel_id;

    try {
        const travel = await TravelPlan.findOne({ where: { travel_id: travelId } });
        res.json(travel);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// 여행계획방 초대
export const addMember = async (req, res) => {
};

// 여행계획방 입장하기
export const enterTravelPlan = async (req, res) => {
    const locationId = req.location.location_id;

    try {
        // 기존 페이지 가져오기
        
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// 여행동선 결과 조회
export const getTravelRoute = async (req, res) => {
    const routeId = req.travelRoute.route_id;

    try {
        const routes = await TravelRoute.findAll({ where: { route_id: routeId } });
        const routeLists = routes.map(routes => new TravelRouteDTO(routes.route_id, routes.route_title, routes.route_order));
        res.json(routeLists);
    } catch (error) {
        res.status(500).send(error.message);
    }
};