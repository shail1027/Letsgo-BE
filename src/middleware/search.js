// middlewares/search.middleware.js
import { fetchData } from '../services/fetchData.js';

export const searchMiddleware = async (req, res, next) => {
  const { q } = req.query;
  const searchTerm = q ? q.toLowerCase() : '';

  if (!searchTerm) {
    return res.status(400).json({ error: '검색어가 필요합니다.' });
  }

  try {
    const data = await fetchData();

    const filteredData = data.filter(item => {
      const address = item.addr1 ? item.addr1.toLowerCase() : '';
      return address.includes(searchTerm);
    }).map(item => ({
      title: item.title,
      address: item.addr1,
      tel: item.tel,
      firstimage: item.firstimage
    }));

    req.filteredData = filteredData;  // 필터링된 데이터를 요청 객체에 저장
    next();  // 다음 미들웨어로 이동
  } catch (error) {
    console.error('데이터 가져오는 중 오류 발생:', error);
    res.status(500).json({ error: '데이터를 가져오는 중 오류가 발생했습니다.' });
  }
};
