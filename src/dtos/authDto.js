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
  