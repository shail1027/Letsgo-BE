export class LocationDto {
    constructor(url) {
        this.url = url;
    }

    isValid() {
        return !!this.url;
    }
}
