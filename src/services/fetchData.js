import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); 

const API_KEY = process.env.API_KEY;  
const ENDPOINT = 'http://apis.data.go.kr/B551011/KorService1/searchStay1';

export const fetchData = async () => {
  const params = {
    ServiceKey: API_KEY,
    MobileOS: 'ETC',  // 운영체제를 여기에 입력하세요 (예: ETC, AND, IOS)
    MobileApp: 'AppTest',  // 앱 이름을 여기에 입력하세요
    _type: 'json',  // JSON 형식의 응답을 받으려면 이 매개변수를 추가합니다.
    numOfRows: 50,  // 한 페이지에 가져올 데이터 수
    pageNo: 1  // 가져올 페이지 번호
  };

  try {
    const response = await axios.get(ENDPOINT, { params });
    const { data } = response;

    if (data.response.header.resultCode === '0000') {
      return data.response.body.items.item;
    } else {
      console.error(`Error: ${data.response.header.resultMsg}`);
      return [];
    }
  } catch (error) {
    console.error('Error fetching data:', error.response ? error.response.data : error.message);
    return [];
  }
};
