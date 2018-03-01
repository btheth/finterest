import React, { Component } from 'react';
import Auth from '../../modules/Auth';
import Header from './partials/header';
import Masonry from 'react-masonry-component';
 
const masonryOptions = {
    transitionDuration: 0
};

const brokenImg = "https://thumb1.shutterstock.com/display_pic_with_logo/2577385/254313409/stock-vector--error-with-red-empty-aquarium-concept-of-page-not-found-under-construction-http-error-254313409.jpg"

//Home page of website - default if not logged in
class Home extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            errors: '',
            fins: []
        };
        this.getFins = this.getFins.bind(this);
        this.handleHeartClick = this.handleHeartClick.bind(this);
        this.handleArrowClick = this.handleArrowClick.bind(this);
        this.addDefaultSrc = this.addDefaultSrc.bind(this);
        this.handleDeleteFin = this.handleDeleteFin.bind(this);
    }

    getFins() {
        fetch('/api/fins/recentfins')
        .then(response => response.json())
        .then(data => {
            this.setState({
                fins: data,
                errors: ''
            });
        }).catch(error => console.error(error))
    }

    componentDidMount() {
        this.getFins();
    }

    handleHeartClick(event) {
        const ind = Number(event.currentTarget.dataset.id);
        if (!Auth.isUserAuthenticated()) {
            this.setState({
                errors: 'Must be logged in to vote on fins'
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

                const errors = xhr.response.errors ? xhr.response.errors : '';

                this.setState({
                  errors
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
                errors: 'Must be logged in to re-fin a fin'
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

                const errors = xhr.response.errors ? xhr.response.errors : '';

                this.setState({
                  errors
                });
              }
            });
            xhr.send(formData);
        }
    }

    handleDeleteFin(event) {
        const ind = Number(event.currentTarget.dataset.id);

        const finId = encodeURIComponent(this.state.fins[ind]._id);
        const formData = `finId=${finId}`;

        const xhr = new XMLHttpRequest();
        xhr.open('post', '/api/fins/deletefin');
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

            const errors = xhr.response.errors ? xhr.response.errors : '';

            this.setState({
              errors
            });
          }
        });
        xhr.send(formData);
    }

    addDefaultSrc(event) {
      event.target.src = brokenImg;
    }

    render() {
        return (
          <div id="body-wrapper">
            <Header />
            <div id='home'>

              <div id="title-div">
                <h1 id="title-text">Recent Fins</h1>
              </div>

              <div id="form-div">
                {this.state.errors && <p className="error-bar">{this.state.errors}</p>}
              </div>

              <div id="main-body">
                <Masonry className={'gallery-class'} elementType={'div'} options={masonryOptions}
                    disableImagesLoaded={false} updateOnEachImageLoad={false}>
                  {this.state.fins.map((d,i) => 
                    <div className="image-element-class">
                        {(Auth.isUserAuthenticated() && d.userId === Auth.getId())? 
                        <div className="delete-btn-div"><button onClick={this.handleDeleteFin} data-id={i} className="delete-btn">&times;</button></div> : <div/>}
                        <div style={{"margin-top":"10px"}} className="fin-img-wrapper"><img onError={this.addDefaultSrc} alt={'Post from ' + d.username} className="fin-img" src={d.imageUrl}/></div>
                        <div className="fin-title">{d.title}</div>
                        <div className="fin-user"><a className="user-link" href={"/user/" + d.username} >{d.username}</a></div>
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

export default Home;