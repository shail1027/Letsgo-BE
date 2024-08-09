import MakeRoom from '../models/travelPlan.js';
import MakeRoomDTO from '../dtos/makeRoomDto.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';

// ESM 환경에서 __dirname 대체
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage: storage });

class MakeRoomController {
    static uploadMiddleware = upload.single('travel_image');
  
    static async createMakeRoom(req, res) {
      try {
        let travel_image_url = null;
        if (req.file) {
          travel_image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }
  
        const makeRoomData = {
          user_id: req.user.user_id, // 로그인한 사용자 ID를 사용
          title: req.body.title,
          region: req.body.region,
          start_date: req.body.start_date,
          end_date: req.body.end_date,
          status: req.body.status,
          explain: req.body.explain,
          start_time: req.body.start_time,
          end_time: req.body.end_time,
          travel_image: travel_image_url
        };
  
        const makeRoom = await MakeRoom.create(makeRoomData);
        res.status(201).json(makeRoom);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  
    static async getMakeRooms(req, res) {
      try {
        const makeRooms = await MakeRoom.findAll();
        res.status(200).json(makeRooms);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  
    static async getMakeRoom(req, res) {
      try {
        const { id } = req.params;
        const makeRoom = await MakeRoom.findByPk(id);
        if (!makeRoom) {
          return res.status(404).json({ error: 'Make Room not found' });
        }
        res.status(200).json(makeRoom);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  
    static async updateMakeRoom(req, res) {
      try {
        let travel_image_url = null;
        if (req.file) {
          travel_image_url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
        }
  
        const { id } = req.params;
        const makeRoomData = {
          user_id: req.user.user_id, // 로그인한 사용자 ID를 사용
          title: req.body.title,
          region: req.body.region,
          start_date: req.body.start_date,
          end_date: req.body.end_date,
          status: req.body.status,
          explain: req.body.explain,
          start_time: req.body.start_time,
          end_time: req.body.end_time,
          travel_image: travel_image_url || req.body.travel_image
        };
  
        const [updated] = await MakeRoom.update(makeRoomData, { where: { travel_id: id } });
        if (!updated) {
          return res.status(404).json({ error: 'Make Room not found' });
        }
        const updatedMakeRoom = await MakeRoom.findByPk(id);
        res.status(200).json(updatedMakeRoom);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  
    static async deleteMakeRoom(req, res) {
      try {
        const { id } = req.params;
        const deleted = await MakeRoom.destroy({ where: { travel_id: id } });
        if (!deleted) {
          return res.status(404).json({ error: 'Make Room not found' });
        }
        res.status(204).send();
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
    static async getMyRooms(req, res) {
      try {
        const myRooms = await MakeRoom.findAll({
          where: { user_id: req.user.user_id },
          attributes: ['title', 'region', 'start_date', 'end_date'] // 필요한 필드만 반환
        });
        res.status(200).json(myRooms);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  }
  
  export default MakeRoomController;