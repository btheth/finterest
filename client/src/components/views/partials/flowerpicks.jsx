import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class FlowerPicks extends Component {
	constructor(props, context) {
		super(props, context);

    this.state = {
      errors: {},
      flowerBoxes: [],
      loading: true
    };

    this.getFlowers = this.getFlowers.bind(this);
    this.handleAddFlower = this.handleAddFlower.bind(this);
    this.handleRemoveFlower = this.handleRemoveFlower.bind(this);
  }

  getFlowers() {
    fetch('/api/flowers/allflowers')
    .then((response) => {
      return response.json();
    })
    .then((flowers) => {
      for (let i = 0; i < flowers.length; i++) {

        for (let j = 0; j < this.props.flowers.length; j++) {
          if (flowers[i]._id == this.props.flowers[j]._id) {
            flowers[i].userQuantity = this.props.flowers[j].userQuantity;
            break;
          }
        }

        if (!flowers[i].hasOwnProperty('userQuantity')) {
          flowers[i].userQuantity = 0;
        }

      }

      this.setState({
        flowerBoxes: flowers,
        loading: false
      });
  
    });
  }

  handleAddFlower(event) {
    const ind = event.currentTarget.dataset.id;
    if (this.state.flowerBoxes[ind].userQuantity < this.state.flowerBoxes[ind].quantity) {
      const newFlowerBoxes = this.state.flowerBoxes.concat([]);
      newFlowerBoxes[ind].userQuantity++;

      this.setState({
        flowerBoxes: newFlowerBoxes
      },
      this.props.handleFlowerChange(newFlowerBoxes[ind]));
    }
  }

  handleRemoveFlower(event) {
    const ind = event.currentTarget.dataset.id;
    if (this.state.flowerBoxes[ind].userQuantity > 0) {
      const newFlowerBoxes = this.state.flowerBoxes.concat([]);
      newFlowerBoxes[ind].userQuantity--;

      this.setState({
        flowerBoxes: newFlowerBoxes
      },
      this.props.handleFlowerChange(newFlowerBoxes[ind]));
    }
  }

  componentWillMount() {
    this.getFlowers();
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
      <div>
        {!this.state.loading && 
        <div id="flower-picker" className="flower-container">
          {this.state.flowerBoxes.map((d,i) => 
            <div className="flower-item">
              <div className="flower-img-div">
                <img className="flower-img" src={d.imageUrl}/>
              </div>
              <div className="flower-name">{d.name}</div>
              <div className="flower-price">{"$" + displayPrice(d.price)}</div>
              <div id="flower-btn-div">
                <button onClick={this.handleRemoveFlower} data-id={i} className={"flower-btn btn btn-sm" + ((this.state.flowerBoxes[i].userQuantity === 0) ? " btn-danger disabled" : " btn-success")}>-</button>
                <div className="flower-num">{d.userQuantity}</div>
                <button onClick={this.handleAddFlower} data-id={i} className={"flower-btn btn btn-sm" + ((this.state.flowerBoxes[i].userQuantity === this.state.flowerBoxes[i].quantity) ? " btn-danger disabled" : " btn-success")}>+</button>
              </div>
            </div>)}
        </div>}
      </div>
    );
  }
}

export default FlowerPicks;