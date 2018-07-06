import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../../../modules/Auth';

function isValid(str) { return /^[\w\-\s]+$/.test(str); }

class BillingInfo extends Component {
	constructor(props, context) {
		super(props, context);

    this.state = {
      errors: {},
    };

    this.submitBilling = this.submitBilling.bind(this);
  }

  submitBilling() {
    let errors = {};

    if (this.props.billing.firstname === '') {
      errors.firstname='Must enter recipient first name'
    } else if (!isValid(this.props.billing.firstname)) {
      errors.firstname='Invalid name'
    }

    if (this.props.billing.lastname === '') {
      errors.lastname='Must enter recipient last name'
    } else if (!isValid(this.props.billing.lastname)) {
      errors.lastname='Invalid name'
    }

    if (this.props.billing.addr1 === '') {
      errors.addr1='Must enter recipient address line 1'
    } else if (!isValid(this.props.billing.addr1)) {
      errors.addr1='Invalid address'
    }

    if (this.props.billing.addr2 === '') {
      errors.addr2='Must enter address line 2'
    } else if (!isValid(this.props.billing.addr2)) {
      errors.addr2='Invalid address'
    }

    if (this.props.billing.ccnum === '') {
      errors.ccnum='Must enter address line 2'
    } else if (!isValid(this.props.billing.ccnum)) {
      errors.ccnum='Invalid credit card number'
    }

    if (this.props.billing.expdate === '') {
      errors.expdate='Must enter address line 2'
    } else if (!isValid(this.props.billing.expdate)) {
      errors.expdate='Invalid credit card number'
    }

    if (this.props.billing.cvcode === '') {
      errors.cvcode='Must enter address line 2'
    } else if (!isValid(this.props.billing.cvcode)) {
      errors.cvcode='Invalid credit card number'
    }

    if (Object.keys(errors).length === 0 && errors.constructor === Object) {
      this.props.handleSubmitBilling();
    } else {
      this.setState({errors:errors})
    }
  }

  render() {

    const getTomorrow = () => {
      const dtToday = new Date();

      let month = dtToday.getMonth() + 1;
      let day = dtToday.getDate() + 1;
      const year = dtToday.getFullYear();

      if(month < 10)
          month = '0' + month.toString();
      if(day < 10)
          day = '0' + day.toString();

      return year + '-' + month + '-' + day;   
    }

    return (
      <div id="wrapper">
        {!this.state.loading &&
        <div>
          <div id="title-div">
            <h1 id="title-text">Billing Info</h1>
          </div>

          <div>Address</div>
          <input onClick={this.props.switchBillingCheckbox} checked={this.props.shippingEqualsBilling} type="checkbox" /> Same as shipping

          {!this.props.shippingEqualsBilling && 
          <div id="billing-address-form">

            {this.state.errors.summary && <p className="error-bar">{this.state.errors.summary}</p>}

            <div className="form-group">
              <label htmlFor="firstname">Recipient First Name</label>
              <input className="form-control" type="text" name="firstname" placeholder="Enter recipient's first name" onChange={this.props.changeBilling} value={this.props.billing.firstname} />
              {this.state.errors.firstname && <p className="error-bar">{this.state.errors.firstname}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="lastname">Recipient Last Name</label>
              <input className="form-control" type="text" name="lastname" placeholder="Enter recipient's last name" onChange={this.props.changeBilling} value={this.props.billing.lastname} />
              {this.state.errors.lastname && <p className="error-bar">{this.state.errors.lastname}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="addr1">Shipping Address</label>
              <input className="form-control" type="text" name="addr1" placeholder="Enter shipping address line 1" onChange={this.props.changeBilling} value={this.props.billing.addr1} />
              {this.state.errors.addr1 && <p className="error-bar">{this.state.errors.addr1}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="addr2">Shipping Address Line 2</label>
              <input className="form-control" type="text" name="addr2" placeholder="Enter shipping address line 2" onChange={this.props.changeBilling} value={this.props.billing.addr2} />
              {this.state.errors.addr2 && <p className="error-bar">{this.state.errors.addr2}</p>}
            </div>

          </div>}

          {this.props.shippingEqualsBilling && 
          <div>
            <div>{this.props.billing.firstname + ' ' + this.props.billing.lastname}</div>
            <div>{this.props.billing.addr1}</div>
            <div>{this.props.billing.addr2}</div>
          </div>}



          <div>Payment</div>

          <div id="billing-payment-form">

            <div className="form-group">
              <label htmlFor="firstname">Credit Card Number</label>
              <input className="form-control" type="text" name="ccnum" placeholder="Enter credit card number" onChange={this.props.changeBilling} value={this.props.billing.ccnum} />
              {this.state.errors.ccnum && <p className="error-bar">{this.state.errors.ccnum}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="firstname">Expiration Date</label>
              <input className="form-control" min={getTomorrow()} type="date" name="expdate" placeholder="Enter expiration date" onChange={this.props.changeBilling} value={this.props.billing.expdate} />
              {this.state.errors.expdate && <p className="error-bar">{this.state.errors.expdate}</p>}
            </div>

            <div className="form-group">
              <label htmlFor="firstname">CV Code</label>
              <input className="form-control" type="text" name="cvcode" placeholder="Enter CV code" onChange={this.props.changeBilling} value={this.props.billing.cvcode} />
              {this.state.errors.cvcode && <p className="error-bar">{this.state.errors.cvcode}</p>}
            </div>

          </div>

          <button onClick={this.props.returnToShipping} className="btn btn-success">Return to Shipping</button>
          <button onClick={this.submitBilling} className="btn btn-success">Finish Checkout</button>
        </div>}

      </div>
    );
  }
}

export default BillingInfo;