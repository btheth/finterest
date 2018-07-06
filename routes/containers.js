const express = require('express');
const jwt = require('jsonwebtoken');
const Container = require('mongoose').model('containers');
const User = require('mongoose').model('users');
const router = express.Router();

router.get('/allcontainers', function(req, res, next) {
	console.log('request for all containers')

  Container.find({}, (err, containers) => {
    if (err) {res.status(400).json({errors:'container lookup failed'})};
    res.status(200).json(containers);
  });
});

router.use('/', (req, res) => {
    res.status(400).end();
});

module.exports = router;