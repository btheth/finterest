import React from 'react';
import { Link } from 'react-router-dom';
import Auth from '../../../modules/Auth';

const Header = () => (
    <div id='Header'>
    	{Auth.isUserAuthenticated() ?
    	<div id="header-bar">
    		<span className="left-btn">
    			<Link to='/recent'><button id="header-button" className="btn btn-info" type='button'>Recent Fins</button></Link>
    			<Link to='/usersearch'><button id="header-button" className="btn btn-info" type='button'>User Search</button></Link>
    		</span>
    		<span id="header-title">Finterest</span>
    		<span className="right-btn">
    			<Link to='/profile'><button id="header-button" className="btn btn-info" type='button'>My Fins</button></Link>
    			<Link to='/' onClick={() => {Auth.deauthenticateUser();}}><button id="header-button-right" className="btn btn-info" type='button'>Log Out</button></Link>
    		</span>
    	</div> :
    	<div id="header-bar">
            <span className="left-btn">
                <Link to='/recent'><button id="header-button" className="btn btn-info" type='button'>Recent Fins</button></Link>
                <Link to='/usersearch'><button id="header-button" className="btn btn-info" type='button'>User Search</button></Link>
            </span>
            <span id="header-title">Finterest</span>
            <span className="right-btn">
                <Link to='/login'><button id="header-button" className="btn btn-info" type='button'>Log In</button></Link>
                <Link to='/register'><button id="header-button-right" className="btn btn-info" type='button'>Register</button></Link>
            </span>
        </div>}
    </div>
)

export default Header;