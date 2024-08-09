class MakeRoomDTO {
    constructor({ user_id, title, region, start_date, end_date, status, explain, start_time, end_time, travel_image }) {
      this.user_id = user_id;
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
  
  export default MakeRoomDTO;
  