import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from './partials/header';

class Inventory extends Component {
	constructor(props, context) {
		super(props, context);

    this.state = {
      errors: {},
      flowers: [],
      containers: []
    };
  }

  render() {
    return (
      <div>
        <Header />
        <div id="home-body-div">
          <div id="Inventory">

            <div id="title-div">
              <h1 id="title-text">Inventory</h1>
            </div>

            <div id="inv-wrapper">
              <div className="inv-col">
                <div className="inv-title">Flowers</div>
              </div>
              <div className="inv-col">
                <div className="inv-title">Containers</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default Inventory;