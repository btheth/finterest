import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../../../modules/Auth';

class ReviewCart extends Component {
	constructor(props, context) {
		super(props, context);

    this.state = {
      errors: {},
      cart: [],
      total: 0,
      loading: true
    };

    this.getCart = this.getCart.bind(this);
  }

  getCart() {
    fetch('/api/users/cust/getcart/' + Auth.getToken(), { 
      method: 'get', 
      headers: {
     'Authorization': Auth.getToken()
      }
    })
    .then((response) => {
      return response.json();
    })
    .then((cart) => {

      let total = 0;
      for (let i = 0; i < cart.length; i++) {
        total += cart[i].price;
      }

      this.setState({
        cart: cart,
        total: total,
        loading: false
      }, () => {
        this.props.handleUpdatePrice(total);
      });
  
    });
  }

  componentDidMount() {
    this.getCart();
  }

  render() {

    const displayPrice = (price) => {
      price = price.toString();
      if (price.split('.').length === 1) {
        price += ".00";
      } else if (price.split('.')[1].length === 0) {
        price += "00";
      } else if (price.split('.')[1].length === 1) {
        price += "0";
      }
      return price;
    }

    return (
      <div id="wrapper">
        {!this.state.loading &&
        <div>
          <div id="title-div">
            <h1 id="title-text">Review Cart</h1>
          </div>

          <div id="cart-body">
          {this.state.cart.map((d,i) =>
            <div className="cart-item-wrapper">
              <div className="cart-item-header">Bouquet {i + 1}</div>
              <div className="cart-flowers">

                <div className="cart-item">
                    <div className="cart-img-div"><img className="cart-image" src={d.container.imageUrl} /></div>
                    <div className="cart-flower-info">
                      <div>{d.container.name}</div>
                      <div>${d.container.price}</div>
                    </div>
                </div>

              {d.flowers.map(f =>
                <div className="cart-item">
                  <div className="cart-img-div"><img className="cart-image" src={f.imageUrl} /></div>
                  <div className="cart-flower-info">
                    <div>{f.name}: {f.userQuantity}</div>
                    <div>${f.price}</div>
                  </div>
                </div>
              )}
              </div>
              <div>Bouquet Price: ${displayPrice(d.price)}</div>
            </div>
            )}
            <div>Total: ${displayPrice(this.state.total)}</div>

            <button onClick={this.props.handleCompleteCartReview}>Proceed to Checkout</button><button onClick={this.props.handleEditCart}>Edit Cart</button>
          </div>
        </div>}

      </div>
    );
  }
}

export default ReviewCart;
