import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from './partials/header';

class EmployeeHome extends Component {
	constructor(props, context) {
		super(props, context);

    this.state = {
      errors: {},
      flowers: [],
      container: '',
      price: 0,
      active: 'flowers'
    };
  }

  render() {
    return (
      <div>
        <Header />
        <div id="home-body-div">
          <div id="Home">

            <div id="title-div">
              <h1 id="title-text">Employee Home</h1>
            </div>

            <div id="employee-home-options">
              <Link to="/"><button className="btn btn-info btn-lg">Manage Orders</button></Link>
              <Link to="/inventory"><button className="btn btn-info btn-lg">Manage Inventory</button></Link>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default EmployeeHome;