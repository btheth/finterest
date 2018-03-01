import React, { Component } from 'react';
import Auth from '../../modules/Auth';
import Header from './partials/header';
import Masonry from 'react-masonry-component';
 
const masonryOptions = {
    transitionDuration: 0
};

const brokenImg = "https://thumb1.shutterstock.com/display_pic_with_logo/2577385/254313409/stock-vector--error-with-red-empty-aquarium-concept-of-page-not-found-under-construction-http-error-254313409.jpg"

//Home page of website - default if not logged in
class User extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            usererrors: '',
            username: '',
            fins: []
        };
        this.getFins = this.getFins.bind(this);
        this.handleHeartClick = this.handleHeartClick.bind(this);
        this.handleArrowClick = this.handleArrowClick.bind(this);
        this.addDefaultSrc = this.addDefaultSrc.bind(this);
    }

    //check for user and display fins as appropriate
    getFins() {
        if (this.props.location.pathname.split('/')[2]) {
            const username = encodeURIComponent(this.props.location.pathname.split('/')[2]);
            let formData = `username=${username}`;

            let xhr = new XMLHttpRequest();
            xhr.open('post', '/api/users/finduser');
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.responseType = 'json';
            xhr.addEventListener('load', () => {
              if (xhr.status === 200) {
                // success
                //console.log(xhr.response)

                const userId = xhr.response._id;
                const username = xhr.response.username;
                formData = `userId=${userId}`;

                xhr = new XMLHttpRequest();
                xhr.open('post', '/api/fins/userfins');
                xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                //xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
                xhr.responseType = 'json';
                xhr.addEventListener('load', () => {
                  if (xhr.status === 200) {
                    // success
                    //console.log(xhr.response)

                    // change the component-container state
                    this.setState({
                      finerrors: '',
                      usererrors: '',
                      username: username,
                      fins: xhr.response
                    });

                  } else {
                    // failure

                    const usererrors = xhr.response.errors ? xhr.response.errors : '';

                    this.setState({
                      usererrors
                    });
                  }
                });
                xhr.send(formData);
              } else {
                // failure

                const usererrors = xhr.response.errors ? xhr.response.errors : '';

                this.setState({
                  usererrors
                });
              }
            });
            xhr.send(formData);
        } else {
            this.setState({
                errors: 'User not found',
                fins: []
            })
        }
    }

    handleHeartClick(event) {
        const ind = Number(event.currentTarget.dataset.id);
        if (!Auth.isUserAuthenticated()) {
            this.setState({
                finerrors: 'Must be logged in to vote on fins'
            });
        } else {
            const userId = encodeURIComponent(Auth.getId());
            const finId = encodeURIComponent(this.state.fins[ind]._id);
            const formData = `userId=${userId}&finId=${finId}`;

            const xhr = new XMLHttpRequest();
            xhr.open('post', '/api/fins/handlelike');
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
            xhr.responseType = 'json';
            xhr.addEventListener('load', () => {
              if (xhr.status === 200) {
                // success
                //console.log(xhr.response)

                this.getFins();
              } else {
                // failure

                const finerrors = xhr.response.errors ? xhr.response.errors : '';

                this.setState({
                  finerrors
                });
              }
            });
            xhr.send(formData);
        }
    }

    handleArrowClick(event) {
        const ind = Number(event.currentTarget.dataset.id);
        if (!Auth.isUserAuthenticated()) {
            this.setState({
                finerrors: 'Must be logged in to re-fin a fin'
            });
        } else  if (this.state.fins[ind].userId !== Auth.getId()) {
            const userId = encodeURIComponent(Auth.getId());
            const finId = encodeURIComponent(this.state.fins[ind]._id);
            const formData = `userId=${userId}&finId=${finId}`;

            const xhr = new XMLHttpRequest();
            xhr.open('post', '/api/fins/handlerefin');
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
            xhr.responseType = 'json';
            xhr.addEventListener('load', () => {
              if (xhr.status === 200) {
                // success
                //console.log(xhr.response)

                this.getFins();
              } else {
                // failure

                const finerrors = xhr.response.errors ? xhr.response.errors : '';

                this.setState({
                  finerrors
                });
              }
            });
            xhr.send(formData);
        }
    }

    componentDidMount() {
        this.getFins();
    }
    
    addDefaultSrc(event) {
      event.target.src = brokenImg;
    }

    render() {
        return (
          <div id="body-wrapper">
            <Header />
            <div id='user'>

              <div id="title-div">
                <h1 id="title-text">{this.state.username ? this.state.username + " Fins" : (this.state.usererrors ? this.state.usererrors : "")}</h1>
              </div>

              <div id="form-div">
                {this.state.finerrors && <p className="error-bar">{this.state.finerrors}</p>}
              </div>

              <div id="main-body">
                <Masonry className={'gallery-class'} elementType={'div'} options={masonryOptions}
                    disableImagesLoaded={false} updateOnEachImageLoad={false}>
                {this.state.fins.map((d,i) => 
                <div className="image-element-class">
                    <div style={{"margin-top":"10px"}} className="fin-img-wrapper"><img onError={this.addDefaultSrc} alt={'Post from ' + d.username} className="fin-img" src={d.imageUrl}/></div>
                    <div className="fin-title">{d.title}</div>
                        <div className="stat-wrapper">
                            <span className="like-span">
                                <div data-id={i} style={{"background-color":(!Auth.isUserAuthenticated() ? "white" : 
                                    (d.likes.indexOf(Auth.getId()) !== -1) ? "red" : "white")}}
                                    onClick={this.handleHeartClick} className="heart"/>
                                {d.likes.length}
                            </span>
                            <span className="arrow-span">
                                <div onClick={this.handleArrowClick} data-id={i} className="arrow" />
                                {d.refins.length}
                            </span>
                        </div>
                    </div>)}
                </Masonry>
              </div>
            
            </div>
          </div>
        )
    }
} 

export default User;