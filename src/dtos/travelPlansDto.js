export class SaveKakaoBookmarkDto {
    constructor(url, userId, listName) {
        this.url = url;
        this.userId = userId;
        this.listName = listName;
    }
}

export class UserListDto {
    constructor(list_id, list_name, location_url, map_app) {
        this.list_id = list_id;
        this.list_name = list_name;
        this.location_url = location_url;
        this.map_app = map_app;
    }
}

export class ListDetailsDto {
    constructor(list_id, list_name, location_url, map_app, places) {
        this.list_id = list_id;
        this.list_name = list_name;
        this.location_url = location_url;
        this.map_app = map_app;
        this.places = places;
    }
}

export class PlaceDto {
    constructor(place_name, address) {
        this.place_name = place_name;
        this.address = address;
    }
}
