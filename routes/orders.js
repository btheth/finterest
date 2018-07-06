const express = require('express');
const jwt = require('jsonwebtoken');
const Order = require('mongoose').model('orders');
const User = require('mongoose').model('users');
const router = express.Router();

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

router.post('/cust/neworder', function(req, res, next) {
	console.log('request for to submit order')

	const token = req.headers.authorization;
	const shipping = JSON.parse(req.body.shipping);
	const billing = JSON.parse(req.body.billing);
	const price = req.body.price;


    return jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
    	if (err) {res.status(400).json({errors:'token decode failed'})};

	  	const userId = decoded.sub;

	  	User.findOne({ _id: userId }, (userErr, user) => {
	  		if (err) {res.status(400).json({errors:'user lookup failed'})};

	  		if (user.type !== "user") {res.status(401).json({errors:"unauthorized access"})};

	  		const orderData = {
		  		userId: userId,
	  			bouquets: user.cart,
	  			price: price,
	  			status: "Submitted",
	  			shipping: shipping,
	  			billing: billing,
	  			date: new Date()
	  		}

	  		const newOrder = new Order(orderData);

	  		console.log(newOrder);

	  		newOrder.save((err) => {
		   		if (err) {res.status(400).json({errors:'order save failed'})};

		   		User.update({ _id: user}, {cart: []}, (err, user) => {
		  			if (err) {res.status(400).json({errors:'user update failed'})};
		  			res.status(200).end();
				});
	  		});
  		});
	});
});

router.use('/', (req, res) => {
    res.status(400).end();
});

module.exports = router;