import React, { Component } from 'react';
import Auth from '../../modules/Auth';
import Header from './partials/header';

const brokenImg = "https://thumb1.shutterstock.com/display_pic_with_logo/2577385/254313409/stock-vector--error-with-red-empty-aquarium-concept-of-page-not-found-under-construction-http-error-254313409.jpg"

//Home page of website - default if not logged in
class Usersearch extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            errors: '',
            finerror: '',
            search: '',
            users: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.submitSearch = this.submitSearch.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.addDefaultSrc = this.addDefaultSrc.bind(this);
    }

    handleChange(event) {
      this.setState({
        search: event.target.value
      });
    }

    submitSearch() {
      const username = encodeURIComponent(this.state.search.trim());
      const formData = `username=${username}`;

      const xhr = new XMLHttpRequest();
      xhr.open('post', '/api/users/usersearch');
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.responseType = 'json';
      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          // success
          //console.log(xhr.response)

          // change the component-container state
          this.setState({
            errors: '',
            finerror: '',
            search: '',
            users: xhr.response
          });

        } else {
          // failure

          const errors = xhr.response.errors ? xhr.response.errors : '';

          this.setState({
            errors,
            users: []
          });
        }
      });
      xhr.send(formData);
    }

    componentDidMount() {
      document.addEventListener("keydown", this.handleKeyPress, false);
    }

    componentWillUnmount() {
      document.removeEventListener("keydown", this.handleKeyPress, false);
    }

    handleKeyPress(event) {
      //treat enter like submit button click
      if (event.keyCode === 13 && this.state.search.trim()) {
          this.submitSearch();
      }
    }

    handleClick() {
      this.setState({
        finerror: 'Visit user page to vote or re-fin'
      })
    }

    addDefaultSrc(event) {
      event.target.src = brokenImg;
    }

    render() {
        return (
          <div>
            <Header />
            <div id='usersearch'>

              <div id="title-div">
                <h1 id="title">User Search</h1>
              </div>

              <div id="user-search-div">
                <input value={this.state.search} onChange={this.handleChange} type="text" placeholder="Enter Username" />
                <button disabled={!this.state.search.trim()} onClick={this.submitSearch} type="text">Search</button>
              </div>

              {this.state.errors ? this.state.errors : <div/>}
              {this.state.finerror ? this.state.finerror : <div/>}

              <div id="user-results-div">
              {this.state.users.map((u,i) => 
                <div className="user-search-result">
                  <div className="user-name"><a href={"/user/" + u.username}>{u.username}</a></div>
                  <div className="user-fins">
                  {u.fins.map((d,i) => 
                    <div className="fin-wrapper">
                    <div style={{"margin-top":"10px"}} className="fin-img-wrapper"><img onError={this.addDefaultSrc} alt={'Post from ' + d.username} className="fin-img" src={d.imageUrl}/></div>
                    <div className="fin-title">{d.title}</div>
                        <div className="stat-wrapper">
                            <span className="like-span">
                                <div data-id={i} style={{"background-color":(!Auth.isUserAuthenticated() ? "white" : 
                                    (d.likes.indexOf(Auth.getId()) !== -1) ? "red" : "white")}}
                                    onClick={this.handleClick} className="heart"/>
                                {d.likes.length}
                            </span>
                            <span className="arrow-span">
                                <div onClick={this.handleClick} data-id={i} className="arrow" />
                                {d.refins.length}
                            </span>
                        </div>
                    </div>
                  )}
                  </div>
                </div>
              )}
              </div>
            
            </div>
          </div>
        )
    }
} 

export default Usersearch;