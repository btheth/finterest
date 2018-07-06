import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../../modules/Auth';
import Header from './partials/header';
import FlowerPicks from './partials/flowerpicks';
import ContainerPicks from './partials/containerpicks';
import FinalizeBouquetEdit from './partials/finalizebouquetedit';

const displayPrice = (price) => {
  price = price.toFixed(2);
  if (price.split('.').length === 1) {
    price += ".00";
  } else if (price.split('.')[1].length === 0) {
    price += "00";
  } else if (price.split('.')[1].length === 1) {
    price += "0";
  }
  return price;
}

class Cart extends Component {
	constructor(props, context) {
		super(props, context);

    this.state = {
      errors: {},
      cart: [],
      loading: true,
      active: "Cart",
      builder: "flowers",
      flowers: [],
      flowerPrice: 0,
      container: '',
      containerPrice: 0,
      bouquetId: ''
    };

    this.getCart = this.getCart.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleStartEdit = this.handleStartEdit.bind(this);
    this.handleCancelEdit = this.handleCancelEdit.bind(this);
    this.handleBuilderChange = this.handleBuilderChange.bind(this);
    this.handleFlowerChange = this.handleFlowerChange.bind(this);
    this.handleContainerChange = this.handleContainerChange.bind(this);
    this.resetState = this.resetState.bind(this);
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
      });
  
    });
  }

  componentDidMount() {
    this.getCart();
  }

  handleDelete(event) {
    fetch('/api/users/cust/removefromcart/' + this.state.cart[event.currentTarget.dataset.id]._id, { 
      method: 'delete', 
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
      })
  
    });
  }

  handleStartEdit(event) {
    const ind = event.currentTarget.dataset.id;
    const bouquetId = this.state.cart[ind]._id;

    const flowers = this.state.cart[ind].flowers;
    const container = this.state.cart[ind].container;

    let flowerPrice = 0;

    for (let i = 0; i < flowers.length; i++) {
      flowerPrice += Number((flowers[i].userQuantity * flowers[i].price).toFixed(2));
    }

    flowerPrice = Number((flowerPrice).toFixed(2));
    const containerPrice = container.price;

    this.setState({
      active: "Edit",
      flowers: flowers,
      container: container,
      flowerPrice: flowerPrice,
      containerPrice: containerPrice,
      bouquetId: bouquetId
    })
  }

  handleCancelEdit() {
    this.setState({
      active: "Cart"
    })
  }

  resetState() {
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
      console.log(cart);
      let total = 0;
      for (let i = 0; i < cart.length; i++) {
        total += cart[i].price;
      }

      this.setState({
        cart: cart,
        total: total,
        loading: false,
        errors: {},
        flowers: [],
        container: '',
        flowerPrice: 0,
        containerPrice: 0,
        active: "Cart",
        builder: "flowers"
      });
    });
  }

  handleBuilderChange(event) {
    if (this.state.builder !== event.currentTarget.dataset.id) {
      if (event.currentTarget.dataset.id === "finalize") {
        if (this.state.flowers.length > 0 && this.state.container !== '') {
          this.setState({
            builder: event.currentTarget.dataset.id
          })
        }
      } else {
        this.setState({
          success: '',
          builder: event.currentTarget.dataset.id
        })
      }
    }
  }

  handleFlowerChange(flowers) {
    let found = false;
    let newFlowers = this.state.flowers.concat([]);

    for (let i = 0; i < newFlowers.length; i++) {
      if (flowers._id === newFlowers[i]._id) {
        found = true;

        if (flowers.userQuantity === 0) {
          newFlowers.splice(i,1);
        } else {
          newFlowers[i] = flowers;
        }

        break;
      }
    }

    if (!found) {
      newFlowers.push(flowers);
    }

    let price = 0;

    for (let i = 0; i < newFlowers.length; i++) {
      price += Number((newFlowers[i].userQuantity * newFlowers[i].price).toFixed(2));
    }

    price = Number((price).toFixed(2));

    this.setState({
      success: '',
      flowers: newFlowers,
      flowerPrice: price
    })

  }

  handleContainerChange(container) {
    const price = container.price;

    this.setState({
      success: '',
      container: container,
      containerPrice: price
    })
  }

  render() {
    return (
      <div>
        <Header />
        <div id="home-body-div">
          <div id="Cart">

            <div id="title-div">
              <h1 id="title-text">{this.state.active}</h1>
            </div>

            <div>
              {(!this.state.loading && this.state.cart.length === 0 && this.state.active === "Cart") && 
                <div>Cart is empty</div>
              }
              {(!this.state.loading && this.state.cart.length > 0 && this.state.active === "Cart") &&
              <div id="cart-body">
                <Link to="/checkout"><button className="btn btn-success">Check Out</button></Link>
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
                    <button data-id={i} onClick={this.handleStartEdit} >Edit</button><button data-id={i} onClick={this.handleDelete} >Delete</button>
                  </div>
                  )}
                <div>Total: ${displayPrice(this.state.total)}</div>
              </div>}
              {(!this.state.loading && this.state.active === "Edit") &&
                <div id="edit-body">
                  <button className="btn btn-danger" onClick={this.handleCancelEdit}>Cancel</button>

                  <div id="outer-build-box">
                    <div id="build-box-header">

                      <div onClick={this.handleBuilderChange} data-id="flowers" id="flower-selector" 
                        className={"build-selector" + ((this.state.builder=="flowers") ? " active-selector" : " inactive-selector")}>
                        Pick Flowers
                      </div>

                      <div onClick={this.handleBuilderChange} data-id="containers" id="container-selector" 
                        className={"build-selector" + ((this.state.builder=="containers") ? " active-selector" : " inactive-selector")}>
                        Pick Container
                      </div>

                      <div onClick={this.handleBuilderChange} data-id="finalize" id="finalize-selector"
                        className={"build-selector"  + ((this.state.flowers.length === 0 || this.state.container === '') ? '' :
                          ((this.state.builder=="finalize") ? " active-selector" : " inactive-selector"))}>
                        Finalize Bouquet
                      </div>

                      <div id="price-display" className="price-display">{"$" + displayPrice(this.state.flowerPrice + this.state.containerPrice)}</div>
                    </div>

                    <div id="build-box-main">
                      {(this.state.builder === "flowers") && <FlowerPicks handleFlowerChange={this.handleFlowerChange} flowers={this.state.flowers} />}
                      {(this.state.builder === "containers") && <ContainerPicks handleContainerChange={this.handleContainerChange} container={this.state.container} />}
                      {(this.state.builder === "finalize") && <FinalizeBouquetEdit resetState={this.resetState} bouquetId={this.state.bouquetId} flowers={this.state.flowers} container={this.state.container} total={displayPrice(this.state.flowerPrice + this.state.containerPrice)} />}
                    </div>
                  </div>

                </div>
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Cart;