import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../../../modules/Auth';

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

class FinalizeBouquetEdit extends Component {
	constructor(props, context) {
		super(props, context);

    this.state = {
      errors: {}
    };

    this.handleSaveEdit = this.handleSaveEdit.bind(this);
  }

  handleSaveEdit() {
    const id = this.props.bouquetId;
    const flowers = this.props.flowers;
    const container = this.props.container;
    const price = displayPrice(this.props.total);

    const bouquet = {
      id: id,
      flowers: flowers,
      container: container,
      price: price
    }

    const formData = `bouquet=${JSON.stringify(bouquet)}`;

    //send post request to server
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/api/users/cust/editbouquet');
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

        //redirect to cart now - this will eventually go to check out
        this.props.resetState();

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
        <div id="flower-list">
          <span className="flower-list-title">Flowers</span>
          {this.props.flowers.map((d,i) => 
            <div className="flower-list-item">
              <div className="flower-list-img-div">
                <img className="flower-list-img" src={d.imageUrl}/>
              </div>
              <div className="flower-info-div">
                <div className="flower-list-name">{d.name}:</div>
                <div className="flower-list-num">{d.userQuantity}</div>
                <div className="flower-list-price">{"$" + displayPrice((d.price * d.userQuantity).toFixed(2))}</div>
              </div>
            </div>)}
        </div>
        <div id="container-list">
          <span className="flower-list-title">Container</span>
          <div className="flower-list-item">
            <div className="flower-list-img-div">
              <img className="flower-list-img" src={this.props.container.imageUrl}/>
            </div>
            <div className="flower-info-div">
              <div className="flower-list-name">{this.props.container.name}</div>
              <div className="flower-list-price">{"$" + displayPrice(this.props.container.price)}</div>
            </div>
          </div>
        </div>
        <div id="finalize-footer">
          <div id="invis-total-price">Total: ${this.props.total}</div>
          <button onClick={this.handleSaveEdit} id="submit-bouquet" className="finalize-btn btn btn-success">Save Bouquet</button>
          <div id="total-price">Total: ${this.props.total}</div>
        </div>
      </div>
    );
  }
}

export default FinalizeBouquetEdit;