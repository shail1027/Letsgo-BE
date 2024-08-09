import Accommodation from '../models/accommodation.js';
import { CreateAccommodationDTO } from '../dtos/accommodationDTO.js';

// 숙박 정보를 저장하는 컨트롤러
export const saveAccommodation = async (req, res) => {
    const { travel_id, title, address, firstimage } = req.body;
  
    // JWT에서 추출한 user_id를 사용
    const user_id = req.user.user_id;
  
    if (!travel_id || !title || !address) {
      return res.status(400).json({ error: 'travel_id, title, and address are required.' });
    }
  
    const accommodationData = new CreateAccommodationDTO({
      user_id,
      travel_id,
      acc_name: title,
      acc_address: address,
      check_in: null,  // 필요 시 실제 값을 입력
      check_out: null, // 필요 시 실제 값을 입력
      acc_image: firstimage,
    });
  
    try {
      const newAccommodation = await Accommodation.create(accommodationData);
      res.status(201).json(newAccommodation);
    } catch (error) {
      console.error('Error saving accommodation:', error);
      res.status(500).json({ error: 'Failed to save accommodation' });
    }
  };
  
// travel_id와 user_id로 숙박 정보를 조회하는 컨트롤러
export const getAccommodationsByTravelId = async (req, res) => {
    const { travel_id } = req.params;
    const user_id = req.user.user_id; // JWT에서 가져온 user_id
  
    try {
      const accommodations = await Accommodation.findAll({
        where: {
          travel_id,
          user_id
        }
      });
  
      if (accommodations.length === 0) {
        return res.status(404).json({ error: 'No accommodations found for this travel_id and user_id' });
      }
  
      res.status(200).json(accommodations);
    } catch (error) {
      console.error('Error retrieving accommodations:', error);
      res.status(500).json({ error: 'Failed to retrieve accommodations' });
    }
  };
  
  // 숙박 정보를 삭제하는 컨트롤러
export const deleteAccommodation = async (req, res) => {
    const { acc_id } = req.params;
  
    try {
      const accommodation = await Accommodation.findByPk(acc_id);
  
      if (!accommodation) {
        return res.status(404).json({ error: 'Accommodation not found' });
      }
  
      await accommodation.destroy();
      res.status(200).json({ message: 'Accommodation deleted successfully' });
    } catch (error) {
      console.error('Error deleting accommodation:', error);
      res.status(500).json({ error: 'Failed to delete accommodation' });
    }
  };