import axios from 'axios';
import cheerio from 'cheerio';
import Location from '../models/location.js';

export const getLocationInfo = async (req, res) => {
    const { url, travel_id } = req.body;

    if (!req.user) {
        return res.status(401).send({ error: 'User not authenticated' });
    }

    const user_id = req.user.dataValues.user_id; // 인증된 사용자 ID 가져오기

    if (!url || travel_id == null || user_id == null) {
        return res.status(400).send({ error: 'URL, travel_id, and user_id are required' });
    }

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
        
        const newLocation = await Location.create({
            travel_id,
            user_id,
            location_name: placeName,
            location_address: address,  
            location_img: imageUrl
        });

        res.status(200).send(newLocation);
    } catch (error) {
        console.error('Error fetching the place info or saving to DB:', error);
        res.status(500).send({ error: 'Error fetching place information' });
    }
};
