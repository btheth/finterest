import React, { Component } from 'react';
import { Link } from 'react-router-dom';

//Home page of website - default if not logged in
class Home extends Component {
    render() {
        return (
            <div id='home'>

                <div id="home-body-div">
                    <div id="home-title-div">
                        <h1 id="title-text">Build-a-Bouquet</h1>
                    </div>

                    <div id="home-main-div">
                        <p id="home-main-text">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do 
                            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut 
                            enim ad minim veniam, quis nostrud exercitation ullamco laboris 
                            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in 
                            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla 
                            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in 
                            culpa qui officia deserunt mollit anim id est laborum.
                        </p>
                    </div>

                    <div id="home-login-div">
                        <div className="home-button-div">
                            <Link to='/login'><button className="home-btn btn btn-success">Log In</button></Link>
                        </div>
                        <div className="home-button-div">
                            <Link to='/register'><button className="home-btn btn btn-success">Sign Up</button></Link>
                        </div>
                    </div>
                </div>
            
            </div>
        )
    }
} 

export default Home;