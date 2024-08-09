export class CreateAccommodationDTO {
    constructor({ user_id, travel_id, acc_name, acc_address, check_in, check_out, acc_image }) {
      this.user_id = user_id;
      this.travel_id = travel_id;
      this.acc_name = acc_name;
      this.acc_address = acc_address;
      this.check_in = check_in;
      this.check_out = check_out;
      this.acc_image = acc_image;
    }
  }
  