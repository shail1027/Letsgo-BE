import { saveKakaoBookmarkList, fetchKakaoBookmarkList } from '../crawler/kakaoCrawler.js';
import MyPlaceList from '../models/myPlaceList.js';
import MyPlaceListMapping from '../models/MyPlaceListMapping.js';
import { SaveKakaoBookmarkDto, UserListDto, ListDetailsDto, PlaceDto } from '../dtos/travelPlansDto.js';

export const createKakaoBookmarks = async (req, res) => {
    const kakaoMapUrl = req.body.url;
    const userId = req.user.user_id;

    if (!kakaoMapUrl) {
        return res.status(400).send('URL is required');
    }

    try {
        const userLists = await MyPlaceList.findAll({ where: { user_id: userId } });
        const listCount = userLists.length;
        const listName = `즐겨찾기${listCount + 1}`;
        const saveKakaoBookmarkDto = new SaveKakaoBookmarkDto(kakaoMapUrl, userId, listName);

        const result = await saveKakaoBookmarkList(saveKakaoBookmarkDto);
        res.json(result);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const getUserLists = async (req, res) => {
    const userId = req.user.user_id;

    try {
        const lists = await MyPlaceList.findAll({ where: { user_id: userId } });
        const userLists = lists.map(list => new UserListDto(list.list_id, list.list_name, list.location_url, list.map_app));
        res.json(userLists);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const getListDetails = async (req, res) => {
    const listId = req.params.listId;

    try {
        const list = await MyPlaceList.findByPk(listId, {
            include: [MyPlaceListMapping]
        });

        if (!list) {
            return res.status(404).send('List not found');
        }

        const places = list.MyPlaceListMappings.map(mapping => new PlaceDto(mapping.place_name, mapping.address));
        const listDetails = new ListDetailsDto(list.list_id, list.list_name, list.location_url, list.map_app, places);
        res.json(listDetails);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const deleteList = async (req, res) => {
    const listId = req.params.listId;

    try {
        const list = await MyPlaceList.findByPk(listId);

        if (!list) {
            return res.status(404).send('List not found');
        }

        // 리스트에 연결된 모든 장소 삭제
        await MyPlaceListMapping.destroy({ where: { list_id: listId } });
        // 리스트 삭제
        await MyPlaceList.destroy({ where: { list_id: listId } });

        res.status(200).json({ message: 'List deleted successfully' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const updateKakaoBookmarks = async (req, res) => {
    const listId = req.params.listId;
    const kakaoMapUrl = req.body.url;
    const userId = req.user.user_id;

    if (!kakaoMapUrl) {
        return res.status(400).send('URL is required');
    }

    try {
        // 기존 리스트 확인
        const existingList = await MyPlaceList.findOne({ where: { user_id: userId, list_id: listId } });

        if (!existingList) {
            return res.status(404).send('List not found');
        }

        // 새로운 북마크 리스트 가져오기
        const placeList = await fetchKakaoBookmarkList(kakaoMapUrl);

        if (placeList.length === 0) {
            return res.status(404).send('No places found in the provided URL.');
        }

        // 기존 리스트 업데이트
        existingList.location_url = kakaoMapUrl;
        await existingList.save();

        // 기존 매핑된 장소 삭제
        await MyPlaceListMapping.destroy({ where: { list_id: listId } });

        // 새로운 장소 매핑 추가
        for (const place of placeList) {
            await MyPlaceListMapping.create({
                list_id: existingList.list_id,
                place_name: place.placeName,
                address: place.address
            });
        }

        res.json({ message: 'Places updated successfully', placeList });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
