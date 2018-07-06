import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../../modules/Auth';
import Header from './partials/header';
import ReviewCart from './partials/reviewcart';
import ShippingInfo from './partials/shippinginfo';
import BillingInfo from './partials/billinginfo';
import ReviewOrder from './partials/revieworder';

class Checkout extends Component {
	constructor(props, context) {
		super(props, context);

    this.state = {
      errors: {},
      price: 0,
      active: "reviewcart",
      shipping: {
        firstname: '',
        lastname: '',
        addr1: '',
        addr2: ''
      },
      billing: {
        firstname: '',
        lastname: '',
        addr1: '',
        addr2: '',
        ccnum: '',
        expdate: '',
        cvcode: ''
      },
      shippingEqualsBilling: false
    };

    this.handleUpdatePrice = this.handleUpdatePrice.bind(this);
    this.handleCompleteCartReview = this.handleCompleteCartReview.bind(this);
    this.handleEditCart = this.handleEditCart.bind(this);
    this.changeShipping = this.changeShipping.bind(this);
    this.handleSubmitShipping = this.handleSubmitShipping.bind(this);
    this.changeBilling = this.changeBilling.bind(this);
    this.switchBillingCheckbox = this.switchBillingCheckbox.bind(this);
    this.handleSubmitBilling = this.handleSubmitBilling.bind(this);
    this.handleSubmitCheckout = this.handleSubmitCheckout.bind(this);
  }

  handleEditCart() {
    this.props.history.push('/cart');
  }

  handleCompleteCartReview() {
    this.setState({active:"shipping"});
  }

  handleUpdatePrice(price) {
    this.setState({
      price: price
    })
  }

  changeShipping(event) {
    const field = event.target.name;
    const shipping = this.state.shipping;
    shipping[field] = event.target.value;
  
    this.setState({
      shipping
    });
  }

  changeBilling(event) {
    const field = event.target.name;
    const billing = this.state.billing;
    billing[field] = event.target.value;
  
    this.setState({
      billing
    });
  }

  switchBillingCheckbox() {
    let billing = {};

    if (!this.state.shippingEqualsBilling) {
      billing.firstname = this.state.shipping.firstname;
      billing.lastname = this.state.shipping.lastname;
      billing.addr1 = this.state.shipping.addr1;
      billing.addr2 = this.state.shipping.addr2;
    } else {
      billing = {
        firstname: '',
        lastname: '',
        addr1: '',
        addr2: ''
      }
    }

    billing.ccnum = this.state.billing.ccnum
    billing.expdate = this.state.billing.expdate,
    billing.cvcode = this.state.billing.cvcode

    this.setState({
      billing: billing,
      shippingEqualsBilling: !this.state.shippingEqualsBilling
    })
  }

  handleSubmitShipping() {
    this.setState({
      active: "billing"
    })
  }

  handleSubmitBilling() {
    this.setState({
      active: "revieworder"
    })
  }

  handleSubmitCheckout() {
    const shipping = this.state.shipping;
    const billing = this.state.billing;
    const price = this.state.price;

    const formData = `shipping=${JSON.stringify(shipping)}&billing=${JSON.stringify(billing)}&price=${price}`;
    console.log(formData);

    //send post request to server
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/api/orders/cust/neworder');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', `${Auth.getToken()}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success

        // change the component-container state
        this.setState({
          errors: "",
        });

        //reset main page state - maybe go to cart instead?
        //this.props.history.push('/');
        

      } else {
        // failure

        const errors = xhr.response.errors ? xhr.response.errors : "";

        this.setState({
          errors
        });
      }
    });
    xhr.send(formData);
  }

  render() {

    return (
      <div>
        <Header />
        <div id="home-body-div">
          <div id="checkout">

            {this.state.active==="reviewcart" && <ReviewCart handleUpdatePrice={this.handleUpdatePrice} 
            handleCompleteCartReview={this.handleCompleteCartReview} handleEditCart={this.handleEditCart}/>}

            {this.state.active==="shipping" && <ShippingInfo shipping={this.state.shipping} changeShipping={this.changeShipping} 
            handleSubmitShipping={this.handleSubmitShipping} />}

            {this.state.active==="billing" && <BillingInfo shippingEqualsBilling={this.state.shippingEqualsBilling}
            billing={this.state.billing} switchBillingCheckbox={this.switchBillingCheckbox} changeBilling={this.changeBilling} 
            returnToShipping={this.handleCompleteCartReview} handleSubmitBilling={this.handleSubmitBilling} />}

            {this.state.active==="revieworder" && <ReviewOrder shipping={this.state.shipping} billing={this.state.billing} 
            handleSubmitCheckout={this.handleSubmitCheckout} handleEditShipping={this.handleCompleteCartReview} handleEditBilling={this.handleSubmitShipping}/>}

          </div>
        </div>
      </div>
    );
  }
}

export default Checkout;