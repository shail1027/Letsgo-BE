export class RegisterDto {
    constructor(email, password, confirmPassword) {
      this.email = email;
      this.password = password;
      this.confirmPassword = confirmPassword;
    }
  }
  
  export class LoginDto {
    constructor(email, password) {
      this.email = email;
      this.password = password;
    }
  }
  
  export class TokenDto {
    constructor(refreshToken) {
      this.refreshToken = refreshToken;
    }
  }
  
  export class GoogleProfileDto {
    constructor(email, displayName, photos) {
      this.email = email;
      this.displayName = displayName;
      this.photos = photos;
    }
  
    static fromProfile(profile) {
      return new GoogleProfileDto(
        profile.emails[0].value,
        profile.displayName,
        profile.photos[0].value
      );
    }
  }