class Auth {

  static authenticateUser(token) {
    localStorage.setItem('bouquet-token', JSON.stringify(token));
  }

  static isUserAuthenticated() {
    return localStorage.getItem('bouquet-token') !== null;
  }

  static deauthenticateUser() {
    localStorage.removeItem('bouquet-token');
  }

  static getToken() {
    return JSON.parse(localStorage.getItem('bouquet-token')).token;
  }

  static getType() {
    return JSON.parse(localStorage.getItem('bouquet-token')).type;
  }
  
}

export default Auth;