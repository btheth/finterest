import React, { Component } from 'react';
import Auth from '../../../modules/Auth';

export default class FacebookLogin extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentDidMount() {
    document.addEventListener('FBObjectReady', this.initializeFacebookLogin);
  }

  componentWillUnmount() {
    document.removeEventListener('FBObjectReady', this.initializeFacebookLogin);
  }

  /**
   * Init FB object and check Facebook Login status
   */
  initializeFacebookLogin = () => {
    if (!this.FB) {
      this.FB = window.FB;
      this.checkLoginStatus();
    }
  }

  /**
   * Check login status
   */
  checkLoginStatus = () => {
    this.FB.getLoginStatus(this.facebookLoginHandler);
  }

  /**
   * Check login status and call login api is user is not logged in
   */
  facebookLogin = () => {
    console.log(this.FB);
    if (!this.FB) {
      this.initializeFacebookLogin();
    }

    this.FB.getLoginStatus(response => {
      if (response.status === 'connected') {
        this.facebookLoginHandler(response);
      } else {
        this.FB.login(this.facebookLoginHandler, {scope: 'public_profile'});
      }
    }, );
  }

  /**
   * Handle login response
   */
  facebookLoginHandler = response => {
    if (response.status === 'connected') {
      this.FB.api('/me', userData => {
        let result = {
          ...response,
          user: userData
        };

        const firstname = encodeURIComponent(userData.name.split(' ')[0]);
        const lastname = encodeURIComponent(userData.name.split(' ')[1]);
        const fbId = encodeURIComponent(userData.id);
        const formData = `firstname=${firstname}&lastname=${lastname}&fbId=${fbId}`;

        const xhr = new XMLHttpRequest();
        xhr.open('post', '/auth/facebook');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            // success
            //console.log(xhr.response);

            // save the token
            Auth.authenticateUser(xhr.response.token);

            this.props.onLogin(true, result);
            this.props.history.push('/');
          } else {
            // failure
            console.log('Error logging in with facebook')
          }
        });
        xhr.send(formData);
      });
    } else {
      this.props.onLogin(false);
    }
  }

  render() {
    let {children} = this.props;
    return (
      <div onClick={this.facebookLogin}>
        {children}
      </div>
    );
  }
}