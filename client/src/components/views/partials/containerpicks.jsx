import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class FlowerPicks extends Component {
	constructor(props, context) {
		super(props, context);

    this.state = {
      errors: {},
      containerBoxes: [],
      selected: -1,
      loading: true
    };
    
    this.getContainers = this.getContainers.bind(this);
    this.handleUpdateContainer = this.handleUpdateContainer.bind(this);
  }

  getContainers() {
    fetch('/api/containers/allcontainers')
    .then((response) => {
      return response.json();
    })
    .then((containers) => {
      let selected = -1;

      for (let i = 0; i < containers.length; i++) {
        if (containers[i]._id == this.props.container._id) {
          selected = i;
          break;
        }
      }

      this.setState({
        containerBoxes: containers,
        selected: selected,
        loading: false
      });
  
    });
  }

  handleUpdateContainer(event) {
    const ind = Number(event.currentTarget.dataset.id);

    if (this.state.selected !== ind) {
      this.setState({
        selected: ind
      })
      this.props.handleContainerChange(this.state.containerBoxes[ind]);
    }

  }

  componentWillMount() {
    this.getContainers();
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
        {! this.state.loading && 
        <div id="container-picker" className="flower-container">
          {this.state.containerBoxes.map((d,i) => 
            <div className="flower-item">
              <div className="flower-img-div">
                <img className="flower-img" src={d.imageUrl}/>
              </div>
              <div className="flower-name">
                <input checked={(i === this.state.selected)} data-id={i} type="radio" readOnly onClick={this.handleUpdateContainer} / > {d.name}
              </div>
              <div className="flower-price">{"$" + displayPrice(d.price)}</div>
            </div>)}
        </div>}
      </div>
    );
  }
}

export default FlowerPicks;