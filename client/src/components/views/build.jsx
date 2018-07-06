import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../../modules/Auth';
import Header from './partials/header';
import FlowerPicks from './partials/flowerpicks';
import ContainerPicks from './partials/containerpicks';
import FinalizeBouquet from './partials/finalizebouquet';

class Build extends Component {
	constructor(props, context) {
		super(props, context);

    this.state = {
      errors: {},
      success: '',
      flowers: [],
      container: '',
      flowerPrice: 0,
      containerPrice: 0,
      active: 'flowers'
    };

    this.handleBuilderChange = this.handleBuilderChange.bind(this);
    this.handleFlowerChange = this.handleFlowerChange.bind(this);
    this.handleContainerChange = this.handleContainerChange.bind(this);
    this.redirectToCart = this.redirectToCart.bind(this);
    this.redirectToCheckout = this.redirectToCheckout.bind(this);
    this.resetState = this.resetState.bind(this);
  }

  handleBuilderChange(event) {
    if (this.state.active !== event.currentTarget.dataset.id) {
      if (event.currentTarget.dataset.id === "finalize") {
        if (this.state.flowers.length > 0 && this.state.container !== '') {
          this.setState({
            active: event.currentTarget.dataset.id
          })
        }
      } else {
        this.setState({
          success: '',
          active: event.currentTarget.dataset.id
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

  redirectToCart() {
    this.props.history.push('/cart');
  }

  redirectToCheckout() {
    this.props.history.push('/checkout');
  }

  resetState() {
    this.setState({
      errors: {},
      success: 'Bouquet added to cart!',
      flowers: [],
      container: '',
      flowerPrice: 0,
      containerPrice: 0,
      active: 'flowers'
    })
  }

  render() {

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

    return (
      <div>
        <Header />
        <div id="home-body-div">
          <div id="build">

            <div id="title-div">
              <h1 id="title-text">Build</h1>
            </div>

            {this.state.success && <div>{this.state.success}</div>}

            <div id="outer-build-box">
              <div id="build-box-header">

                <div onClick={this.handleBuilderChange} data-id="flowers" id="flower-selector" 
                  className={"build-selector" + ((this.state.active=="flowers") ? " active-selector" : " inactive-selector")}>
                  Pick Flowers
                </div>

                <div onClick={this.handleBuilderChange} data-id="containers" id="container-selector" 
                  className={"build-selector" + ((this.state.active=="containers") ? " active-selector" : " inactive-selector")}>
                  Pick Container
                </div>

                <div onClick={this.handleBuilderChange} data-id="finalize" id="finalize-selector"
                  className={"build-selector"  + ((this.state.flowers.length === 0 || this.state.container === '') ? '' :
                    ((this.state.active=="finalize") ? " active-selector" : " inactive-selector"))}>
                  Finalize Bouquet
                </div>

                <div id="price-display" className="price-display">{"$" + displayPrice(this.state.flowerPrice + this.state.containerPrice)}</div>
              </div>
              
              <div id="build-box-main">
                {(this.state.active === "flowers") && <FlowerPicks handleFlowerChange={this.handleFlowerChange} flowers={this.state.flowers} />}
                {(this.state.active === "containers") && <ContainerPicks handleContainerChange={this.handleContainerChange} container={this.state.container} />}
                {(this.state.active === "finalize") && <FinalizeBouquet redirectToCheckout={this.redirectToCheckout} redirectToCart={this.redirectToCart} resetState={this.resetState} flowers={this.state.flowers} container={this.state.container} total={displayPrice(this.state.flowerPrice + this.state.containerPrice)} />}
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default Build;