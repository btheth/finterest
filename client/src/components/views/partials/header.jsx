import React from 'react';
import { Link } from 'react-router-dom';
import Auth from '../../../modules/Auth';

const Header = () => (
    <div id="header-bar">
        <span className="left-btn">
            <span id="header-title">Buid-a-Bouquet</span>
        </span>
        <span className="right-btn">
            <Link to='/'><button id="header-button" className="btn btn-info" type='button'>Home</button></Link>
            <Link to='/cart'><button id="header-button" className="btn btn-info" type='button'>Cart</button></Link>
            <Link to='/' onClick={() => {Auth.deauthenticateUser();}}><button id="header-button-right" className="btn btn-info" type='button'>Log Out</button></Link>
        </span>
    </div>
)

export default Header;