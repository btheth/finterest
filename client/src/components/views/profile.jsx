import React, { Component } from 'react';
import Auth from '../../modules/Auth';
import Header from './partials/header';
import Masonry from 'react-masonry-component';
 
const masonryOptions = {
    transitionDuration: 0
};

const brokenImg = "https://thumb1.shutterstock.com/display_pic_with_logo/2577385/254313409/stock-vector--error-with-red-empty-aquarium-concept-of-page-not-found-under-construction-http-error-254313409.jpg"

function testImage(url, timeoutT) {
    return new Promise(function (resolve, reject) {
        var timeout = timeoutT || 1000;
        var timer, img = new Image();
        img.onerror = img.onabort = function () {
            clearTimeout(timer);
            reject("error");
        };
        img.onload = function () {
            clearTimeout(timer);
            resolve("success");
        };
        timer = setTimeout(function () {
            // reset .src to invalid URL so it stops previous
            // loading, but doesn't trigger new load
            img.src = "//!!!!/test.jpg";
            reject("timeout");
        }, timeout);
        img.src = url;
    });
}

//Home page of website - default if not logged in
class Profile extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            errors: '',
            addError: '',
            showAdd: false,
            imageValue: '',
            imageUrl: '',
            imageTitle: '',
            fins: []
        };
        this.getFins = this.getFins.bind(this);
        this.handleAddBox = this.handleAddBox.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleImgCheck = this.handleImgCheck.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleAddFin = this.handleAddFin.bind(this);
        this.handleDeleteFin = this.handleDeleteFin.bind(this);
        this.handleHeartClick = this.handleHeartClick.bind(this);
        this.addDefaultSrc = this.addDefaultSrc.bind(this);
    }

    getFins() {
        const userId = encodeURIComponent(Auth.getId());
        const formData = `userId=${userId}`;

        const xhr = new XMLHttpRequest();
        xhr.open('post', '/api/fins/userfins');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            // success
            //console.log(xhr.response)

            // change the component-container state
            this.setState({
              errors: '',
              fins: xhr.response
            });

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

    handleKeyPress(event) {
        //treat enter like submit button click
        if (event.keyCode === 13 && this.state.imageValue) {
            this.handleImgCheck();
        }
    }

    handleAddBox() {
        if (this.state.showAdd) {
            document.removeEventListener("keydown", this.handleKeyPress, false);
        } else {
            document.addEventListener("keydown", this.handleKeyPress, false);
        }

        this.setState ({
            showAdd: !this.state.showAdd,
            imageValue: '',
            imageUrl: '',
            imageTitle: '',
            addError: ''
        })
    }

    handleInputChange(event) {
        this.setState({
            imageValue: event.target.value
        });
    }

    handleTitleChange(event) {
        this.setState({
            imageTitle: event.target.value
        });
    }

    handleImgCheck() {
        const promise = testImage(this.state.imageValue);
        promise.then((success) => {
            this.setState({
                addError: '',
                imageUrl: this.state.imageValue
            });
        }).catch(() => {
            this.setState({
                addError: 'Image not found - look for errors and try again',
                imageUrl: '',
            });
         })
    }

    handleAddFin() {
        const userId = encodeURIComponent(Auth.getId());
        const title = encodeURIComponent(this.state.imageTitle.trim());
        const imageUrl = encodeURIComponent(this.state.imageUrl);
        const formData = `userId=${userId}&title=${title}&imageUrl=${imageUrl}`;

        const xhr = new XMLHttpRequest();
        xhr.open('post', '/api/fins/addfin');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('Authorization', `bearer ${Auth.getToken()}`);
        xhr.responseType = 'json';
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            // success
            //console.log(xhr.response)

            // change the component-container state
            this.setState({
              errors: '',
              fins: xhr.response,
              showAdd: false,
              imageValue: '',
              imageUrl: '',
              imageTitle: '',
              addError: ''
            });

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

            // change the component-container state
            this.setState({
              errors: '',
              fins: xhr.response
            });

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

    handleHeartClick(event) {
        const ind = Number(event.currentTarget.dataset.id);

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
            <div id='profile'>

              <div id="overlay" className={!this.state.showAdd ? "hidden" : ""}/>

              <div id="add-box" className={!this.state.showAdd ? "hidden" : ""}>
                <div id="add-header">
                    New Fin
                    <button onClick={this.handleAddBox} type="text" className="delete-btn-add-box">&times;</button>
                </div>
                {this.state.addError ? <div className="error-bar">{this.state.addError}</div> : <div/>}
                <div id="add-body">
                    Fin Title:
                    <div className="add-box-input">
                        <input id="title-input" value={this.state.titleValue} type="text" placeholder="Enter title..." onChange={this.handleTitleChange} />
                    </div>
                    Image URL:
                    <div className="add-box-input">
                        <input id="img-input" value={this.state.imageValue} type="text" placeholder="Enter image url..." onChange={this.handleInputChange} />
                        <button id="img-btn" className="btn btn-success btn-sm" tabIndex="1" type="text" onClick={this.handleImgCheck}>Go!</button>
                    </div>
                    <div id="img-preview-div">
                        {this.state.imageUrl ? <img onError={this.addDefaultSrc} alt="Preview of search" id="img-preview" src={this.state.imageUrl} /> : <div/>}
                    </div>
                    <button id="add-submit" className="btn btn-success" onClick={this.handleAddFin} disabled={this.state.imageUrl === '' || this.state.imageTitle.trim() === ''}>Submit</button>
                </div>
              </div>

              <div id="title-div">
                <h1 id="title-text">My Fins</h1>
              </div>

              <div id="main-body">
                <div id="add-btn-div">
                    <button onClick={this.handleAddBox} className="btn btn-success add-btn">Add fin</button>
                </div>

                <div id="fin-body">
                <Masonry className={'gallery-class'} elementType={'div'} options={masonryOptions}
                    disableImagesLoaded={false} updateOnEachImageLoad={false}>
                    {this.state.fins.map((d,i) => 
                        <div className="image-element-class">
                            <div className="delete-btn-div"><button onClick={this.handleDeleteFin} data-id={i} className="delete-btn">&times;</button></div>
                            <div className="fin-img-wrapper"><img onError={this.addDefaultSrc} alt={'Post from ' + d.username} className="fin-img" src={d.imageUrl}/></div>
                            <div className="fin-title">{d.title}</div>
                            <div className="stat-wrapper">
                                <span className="like-span">
                                    <div onClick={this.handleHeartClick} data-id={i} style={{"background-color":(d.likes.indexOf(Auth.getId()) !== -1) ? "red" : "white"}} className="heart"/>
                                    {d.likes.length}
                                </span>
                                <span className="arrow-span">
                                    <div className="arrow"/>
                                    {d.refins.length}
                                </span>
                            </div>
                        </div>)}
                    </Masonry>
                </div>
              </div>
            
            </div>
          </div>
        )
    }
} 

export default Profile;