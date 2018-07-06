const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('mongoose').model('users');
const Bouquet = require('mongoose').model('bouquets');
const router = express.Router();

function isValid(str) { return /^\w+$/.test(str); }

router.post('/cust/addbouquet', function(req, res, next) {
	console.log('request to add bouquet to cart');

	const token = req.headers.authorization;
	const bouquet = JSON.parse(req.body.bouquet);

    return jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
    	if (err) {res.status(400).json({errors:'token decode failed'})};

	  	const userId = decoded.sub;

	  	User.findOne({ _id: userId }, (userErr, user) => {
	  		if (err) {res.status(400).json({errors:'user lookup failed'})};

	  		if (user.type !== "user") {res.status(401).json({errors:"unauthorized access"})};

	  		const bouquetData = {
		  		userId: userId,
	  			flowers: bouquet.flowers,
	  			container: bouquet.container,
	  			price: bouquet.price
	  		}

	  		const newBouquet = new Bouquet(bouquetData);

	  		newBouquet.save((err) => {
		   		if (err) {res.status(400).json({errors:'bouquet save failed'})};
		      	

		      	const newCart = user.cart.concat(newBouquet._id);

		  		User.update({ _id: user}, {cart: newCart}, (err, user) => {
		  			if (err) {res.status(400).json({errors:'user update failed'})};
		  			res.status(200).end();
				});
	  		});
  		});
	});
});

router.post('/cust/editbouquet', function(req, res, next) {
	console.log('request to edit bouquet in cart');

	const token = req.headers.authorization;
	const bouquet = JSON.parse(req.body.bouquet);

    return jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
    	if (err) {res.status(400).json({errors:'token decode failed'})};

	  	const userId = decoded.sub;

	  	User.findOne({ _id: userId }, (userErr, user) => {
	  		if (err) {res.status(400).json({errors:'user lookup failed'})};

	  		if (user.type !== "user") {res.status(401).json({errors:"unauthorized access"})};

	  		Bouquet.update({ _id: bouquet.id}, {flowers: bouquet.flowers, container: bouquet.container, price: bouquet.price}, (err, user) => {
	  			if (err) {res.status(400).json({errors:'user update failed'})};
	  			res.status(200).end();
			});
  		});
	});

});	

router.get('/cust/getcart/*', function(req, res, next) {
	console.log("request for user's cart");

	const token = req.url.split('/')[3];

	return jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
    	if (err) {res.status(400).json({errors:'token decode failed'})};

	  	const userId = decoded.sub;

	  	User.findOne({ _id: userId }, (userErr, user) => {
	  		if (err) {res.status(400).json({errors:'user lookup failed'})};

	  		let bouquetIds = [];

	  		for (let i = 0; i < user.cart.length; i++) {
	  			bouquetIds.push(user.cart[i]);
	  		}

	  		Bouquet.find({ _id : { $in : bouquetIds}}, (err, bouquets) => {
	  			if (err) {res.status(400).json({errors:'bouquet lookup failed'})};
	  			res.status(200).json(bouquets);
	  		})
  		});
	});
});

router.delete('/cust/removefromcart/*', function(req, res, next) {
	console.log("request to remove user's cart");

	const bouquetId = req.url.split('/')[3];
	const token = req.headers.authorization;

	return jwt.verify(token, process.env.JWTSECRET, (err, decoded) => {
    	if (err) {res.status(400).json({errors:'token decode failed'})};

	  	const userId = decoded.sub;

	  	User.findOne({ _id: userId }, (userErr, user) => {
	  		if (err) {res.status(400).json({errors:'user lookup failed'})};

	  		let bouquetIds = user.cart.map(d => d.toString());
	  		const ind = bouquetIds.indexOf(bouquetId.toString());
	  		bouquetIds.splice(ind,1);

	  		User.update( {_id: userId}, {cart: bouquetIds}, (err, user) => {
	  			if (err) {res.status(400).json({errors:'user update failed'})};

	  			Bouquet.findOneAndRemove({_id: bouquetId}, (err) => {
	  				if (err) {res.status(400).json({errors:'bouquet lookup failed'})};

	  				Bouquet.find( { _id : { $in : bouquetIds}}, (err, bouquets) => {
	  					if (err) {res.status(400).json({errors:'bouquet lookup failed'})};
	  					res.status(200).json(bouquets);
	  				})
	  			})
	  		})
  		});
	});
});

router.use('/', (req, res) => {
  	res.status(400).end();
});

module.exports = router;