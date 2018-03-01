import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../../modules/Auth';
import Header from './partials/header';
//import FacebookLoginButton from './partials/FacebookLoginButton';

class Login extends Component {
	constructor(props, context) {
		super(props, context);
    const storedMessage = localStorage.getItem('successMessage');
    let successMessage = '';

    if (storedMessage) {
      successMessage = storedMessage;
      localStorage.removeItem('successMessage');
    }

    this.state = {
      errors: {},
      successMessage,
      user: {
        username: '',
        password: ''
      }
    };
    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.facebookError = this.facebookError.bind(this);
  }

  processForm(event) {
    event.preventDefault();

    const username = encodeURIComponent(this.state.user.username);
    const password = encodeURIComponent(this.state.user.password);
    const formData = `username=${username}&password=${password}`;

    //console.log('username:', this.state.user.username);
    //console.log('password:', this.state.user.password);

    const xhr = new XMLHttpRequest();
    xhr.open('post', '/auth/login');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        this.setState({
          errors: {}
        });

        // save the token
        Auth.authenticateUser(xhr.response.token);

        // change the current URL to /
        this.props.history.push('/');
      } else {
        // failure

        // change the error message
        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;

        this.setState({
          errors
        });
      }
    });
    xhr.send(formData);
  }

  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  }

  facebookError() {
    this.setState({
      errors: {summary : "Facebook has blocked this site for content violations for some reason. " +
      "I'm not going through the process to unblock it since this site was only built for learning purposes. " +
      "You will have to create an account to continue. You can find the facebook login code on github if you are interested."}
    })
  }

  onFacebookLogin = (loginStatus, resultObject) => {
    if (loginStatus === true) {
      this.setState({
        username: resultObject.user.name
      });
    } else {
      //alert('Facebook login error');
    }
  }

  render() {
    return (
      <div id="body-wrapper">
        <Header />
        <div id="login">

          <div id="title-div">
            <h1 id="title-text">Login</h1>
          </div>

          <div id="form-div">
            <form action="/" onSubmit={this.processForm}>

              {this.state.errors.summary && <p className="error-bar">{this.state.errors.summary}</p>}
          
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input className="form-control" type="text" name="username" placeholder="Enter username" onChange={this.changeUser} value={this.state.user.username} />
              </div>
            
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input className="form-control" type="password" name="password" placeholder="Enter password" onChange={this.changeUser} value={this.state.user.password} />
              </div>

              <button className="btn btn-success" type="submit">Submit</button>
            </form>

             <div id="fb-login">
              {/**<FacebookLoginButton history={this.props.history} onLogin={this.onFacebookLogin}>
                <button className="btn btn-primary">Facebook Login</button>
              </FacebookLoginButton>**/}
              <button onClick={this.facebookError} className="btn btn-primary">Facebook Login</button>
            </div>

            <div className="other-login-option">
              Need an account?
              <br/>
              <Link to={'/register'}><button className="btn btn-info btn-sm" type='button'>Register</button></Link>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default Login;