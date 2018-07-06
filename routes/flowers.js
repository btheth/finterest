const express = require('express');
const jwt = require('jsonwebtoken');
const Flower = require('mongoose').model('flowers');
const User = require('mongoose').model('users');
const router = express.Router();

router.get('/allflowers', function(req, res, next) {
	console.log('request for all flowers')

  Flower.find({}, (err, flowers) => {
    if (err) {res.status(400).json({errors:'flower lookup failed'})};
    res.status(200).json(flowers);
  });
});

router.use('/', (req, res) => {
    res.status(400).end();
});

module.exports = router;