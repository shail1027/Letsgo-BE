import { saveKakaoBookmarkList, fetchKakaoBookmarkList } from '../crawler/kakaoCrawler.js';
import MyPlaceList from '../models/myPlaceList.js';
import MyPlaceListMapping from '../models/MyPlaceListMapping.js';
import FavoriteList from '../models/FavoriteList.js'; // 추가
import { SaveKakaoBookmarkDto, UserListDto, ListDetailsDto, PlaceDto } from '../dtos/travelPlansDto.js';

export const createKakaoBookmarks = async (req, res) => {
    const kakaoMapUrl = req.body.url;
    const userId = req.user.user_id;

    if (!kakaoMapUrl) {
        return res.status(400).send('URL is required');
    }

    try {
        const saveKakaoBookmarkDto = new SaveKakaoBookmarkDto(kakaoMapUrl, userId, ''); // 리스트 이름을 빈 문자열로 초기화
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

// export const addPlaceToFavoriteList = async (req, res) => {
//     const listId = req.body.listId;
//     const userId = req.user.user_id;

//     try {
//         // 리스트 상세 정보 조회
//         const list = await MyPlaceList.findByPk(listId, {
//             include: [MyPlaceListMapping]
//         });

//         if (!list) {
//             return res.status(404).send('List not found');
//         }

//         // favoritelist 테이블에 저장
//         for (const mapping of list.MyPlaceListMappings) {
//             await FavoriteList.create({
//                 user_id: userId,
//                 travel_id: listId,
//                 list_name: list.list_name,
//                 place_name: mapping.place_name,
//                 address: mapping.address
//             });
//         }

//         res.status(201).send('Places added to favorite list successfully');
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// };
export const addPlaceToFavoriteList = async (req, res) => {
    const { listId, travelId, listName } = req.body;  // 올바르게 변수를 추출하고 있는지 확인
    const userId = req.user.user_id;

    try {
        const list = await MyPlaceList.findByPk(listId, {
            include: [MyPlaceListMapping]
        });

        if (!list) {
            return res.status(404).send('List not found');
        }

        for (const mapping of list.MyPlaceListMappings) {
            await FavoriteList.create({
                user_id: userId,
                travel_id: travelId,  // 올바르게 travelId를 사용하고 있는지 확인
                list_name: listName,
                place_name: mapping.place_name,
                address: mapping.address
            });
        }

        res.status(201).send('Places added to favorite list successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const getFavoriteList = async (req, res) => {
    const userId = req.params.userId;

    try {
        console.log('Requested user ID:', userId); // 디버깅용 로그
        const favoriteLists = await FavoriteList.findAll({
            where: { user_id: userId }
        });

        if (favoriteLists.length === 0) {
            return res.status(404).send('No favorite lists found');
        }

        res.json(favoriteLists);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

export const getAllFavoriteLists = async (req, res) => {
    try {
        const favoriteLists = await FavoriteList.findAll();

        if (favoriteLists.length === 0) {
            return res.status(404).send('No favorite lists found');
        }

        res.json(favoriteLists);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// 현재 사용자의 즐겨찾기 목록 조회
// export const getMyFavoriteList = async (req, res) => {
//     const userId = req.user.user_id;

//     try {
//         const favoriteLists = await FavoriteList.findAll({
//             where: { user_id: userId }
//         });

//         if (favoriteLists.length === 0) {
//             return res.status(404).send('No favorite lists found');
//         }

//         res.json(favoriteLists);
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// };
export const getMyFavoriteList = async (req, res) => {
    const userId = req.user.user_id;
    const { listName } = req.query; // listName을 쿼리 파라미터로 받습니다.

    try {
        const whereClause = {
            user_id: userId,
            ...(listName && { list_name: listName }) // Optional: listName이 제공된 경우에만 where 절에 포함
        };

        const favoriteLists = await FavoriteList.findAll({
            where: whereClause
        });

        if (favoriteLists.length === 0) {
            return res.status(404).send('No favorite lists found');
        }

        res.json(favoriteLists);
    } catch (error) {
        res.status(500).send(error.message);
    }
};
export const deleteFavoriteList = async (req, res) => {
    const { listName } = req.params; // 클라이언트가 listName을 통해 삭제하길 원할 때
    const userId = req.user.user_id;

    try {
        const result = await FavoriteList.destroy({
            where: { user_id: userId, list_name: listName }
        });

        if (result === 0) {
            return res.status(404).send('No favorite lists found to delete');
        }

        res.status(200).send('Favorite lists deleted successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
};
