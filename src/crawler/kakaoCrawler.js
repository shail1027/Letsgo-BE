import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import MyPlaceList from '../models/myPlaceList.js';
import MyPlaceListMapping from '../models/MyPlaceListMapping.js';

export const fetchKakaoBookmarkList = async (url) => {
    const options = new chrome.Options();
    options.addArguments('--headless'); // 헤드리스 모드로 실행
    options.addArguments('--no-sandbox'); // 샌드박스 비활성화
    options.addArguments('--disable-dev-shm-usage'); // 공유 메모리 사용 비활성화
    options.addArguments('--disable-gpu'); // GPU 사용 비활성화 (선택 사항)

    const driver = await new Builder().forBrowser('chrome').setChromeOptions(options).build();
    try {
        console.log('Navigating to URL:', url);
        await driver.get(url);
        console.log('Waiting for FavoriteDetailItem element to be located');
        await driver.wait(until.elementLocated(By.css('ul.list_body li.FavoriteDetailItem')), 10000);

        console.log('Finding list name element');
        let listName = '';
        try {
            const listNameElement = await driver.findElement(By.css('h4.tit_summary'));
            listName = await listNameElement.getText();
        } catch (error) {
            console.error('Error fetching the list name element:', error);
        }

        console.log('List name:', listName);

        console.log('Finding place name and address elements');
        const places = await driver.findElements(By.css('ul.list_body li.FavoriteDetailItem'));
        const placeList = [];

        for (const place of places) {
            const placeNameElement = await place.findElement(By.css('a.link_txt'));
            const addressElement = await place.findElement(By.css('span.desc_region'));

            const placeName = await placeNameElement.getText();
            const address = await addressElement.getText();

            placeList.push({
                placeName,
                address
            });
        }

        console.log('Places:', placeList);
        return { listName, placeList };
    } catch (error) {
        console.error('Error fetching the bookmark list:', error);
        return { listName: '', placeList: [] };
    } finally {
        await driver.quit();
    }
}

export const saveKakaoBookmarkList = async (saveKakaoBookmarkDto) => {
    const { url, userId, listName: inputListName, listId } = saveKakaoBookmarkDto;
    const { listName: fetchedListName, placeList } = await fetchKakaoBookmarkList(url);

    const listName = inputListName || fetchedListName;

    if (placeList && placeList.length > 0) {
        // 기존 리스트 확인
        let myPlaceList;
        if (listId) {
            myPlaceList = await MyPlaceList.findOne({ where: { list_id: listId, user_id: userId } });
            if (myPlaceList) {
                // 기존 매핑된 장소 삭제
                await MyPlaceListMapping.destroy({ where: { list_id: listId } });
                // 기존 리스트 업데이트
                myPlaceList.location_url = url;
                myPlaceList.list_name = listName;
                await myPlaceList.save();
            }
        }

        // 리스트가 없으면 새로 생성
        if (!myPlaceList) {
            myPlaceList = await MyPlaceList.create({
                user_id: userId, // 로그인한 사용자의 ID
                list_name: listName,
                location_url: url,
                map_app: 0 // Kakao
            });
        }

        // 새로운 장소 매핑 추가
        for (const place of placeList) {
            await MyPlaceListMapping.create({
                list_id: myPlaceList.list_id,
                place_name: place.placeName,
                address: place.address
            });
        }

        return { message: 'Places saved successfully', placeList };
    } else {
        throw new Error('No place information found or error occurred.');
    }
}
