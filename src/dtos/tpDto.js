export class TravelPlanDto {
    constructor(travel_id, title, region, start_date, end_date) {
        this.travel_id = travel_id;
        this.title = title;
        this.region = region;
        this.start_date = start_date;
        this.end_date = end_date;
        this.status = status;
        this.explain = explain;
        this.start_time = start_time;
        this.end_time = end_time;
        this.travel_image = travel_image;
    }
}

export class TravelPlanListDto {
    constructor(travel_id, title, region, start_date, end_date) {
        this.travel_id = travel_id;
        this.title = title;
        this.region = region;
        this.start_date = start_date;
        this.end_date = end_date;
    }
}

export class AccomodationsDTO {
    constructor(acc_id, acc_name, acc_address, check_in, check_out, acc_image) {
        this.acc_id = acc_id;
        this.acc_name = acc_name;
        this.acc_address = acc_address;
        this.check_in = check_in;
        this.check_out = check_out;
        this.acc_image = acc_image;
    }
}

export class TravelRouteDTO {
    constructor(route_id, route_title, route_order) {
        this.route_id = route_id;
        this.route_title = route_title;
        this.route_order = route_order;
    }
}