import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../../../modules/Auth';

function isValid(str) { return /^[\w\-\s]+$/.test(str); }

class ShippingInfo extends Component {
	constructor(props, context) {
		super(props, context);

    this.state = {
      errors: {}
    };

    this.submitShipping = this.submitShipping.bind(this);
  }

  submitShipping() {
    let errors = {};

    if (this.props.shipping.firstname === '') {
      errors.firstname='Must enter recipient first name'
    } else if (!isValid(this.props.shipping.firstname)) {
      errors.firstname='Invalid name'
    }

    if (this.props.shipping.lastname === '') {
      errors.lastname='Must enter recipient last name'
    } else if (!isValid(this.props.shipping.lastname)) {
      errors.lastname='Invalid name'
    }

    if (this.props.shipping.addr1 === '') {
      errors.addr1='Must enter recipient address line 1'
    } else if (!isValid(this.props.shipping.addr1)) {
      errors.addr1='Invalid address'
    }

    if (this.props.shipping.addr2 === '') {
      errors.addr2='Must enter address line 2'
    } else if (!isValid(this.props.shipping.addr2)) {
      errors.addr2='Invalid address'
    }

    if (Object.keys(errors).length === 0 && errors.constructor === Object) {
      this.props.handleSubmitShipping();
    } else {
      this.setState({errors:errors})
    }
  }

  render() {

    return (
      <div id="wrapper">
        {!this.state.loading &&
        <div>
          <div id="title-div">
            <h1 id="title-text">Shipping Info</h1>
          </div>

          <div id="shipping-form">

            {this.state.errors.summary && <p className="error-bar">{this.state.errors.summary}</p>}

            <div className="form-group">
              <label htmlFor="firstname">Recipient First Name</label>
              <input className="form-control" type="text" name="firstname" placeholder="Enter recipient's first name" onChange={this.props.changeShipping} value={this.props.shipping.firstname} />
              {this.state.errors.firstname && <p className="error-bar">{this.state.errors.firstname}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="lastname">Recipient Last Name</label>
              <input className="form-control" type="text" name="lastname" placeholder="Enter recipient's last name" onChange={this.props.changeShipping} value={this.props.shipping.lastname} />
              {this.state.errors.lastname && <p className="error-bar">{this.state.errors.lastname}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="addr1">Shipping Address</label>
              <input className="form-control" type="text" name="addr1" placeholder="Enter shipping address line 1" onChange={this.props.changeShipping} value={this.props.shipping.addr1} />
              {this.state.errors.addr1 && <p className="error-bar">{this.state.errors.addr1}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="addr2">Shipping Address Line 2</label>
              <input className="form-control" type="text" name="addr2" placeholder="Enter shipping address line 2" onChange={this.props.changeShipping} value={this.props.shipping.addr2} />
              {this.state.errors.addr2 && <p className="error-bar">{this.state.errors.addr2}</p>}
            </div>

            <button onClick={this.submitShipping} className="btn btn-success">Proceed to Billing</button>

          </div>
        </div>}

      </div>
    );
  }
}

export default ShippingInfo;