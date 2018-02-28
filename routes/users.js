const express = require('express');
const User = require('mongoose').model('users');
const Fin = require('mongoose').model('fins');
const router = express.Router();

function isValid(str) { return /^\w+$/.test(str); }

router.post('/userinfo', function(req, res, next) {
	console.log('user info requested');
	const userId = req.body.userId.trim();

	User.findOne({ _id: userId }, (err, user) => {
		if (err) {res.status(400).json({errors:'user lookup failed'})};
		res.status(200).json(user);
	})
});

router.post('/finduser', function(req, res, next) {
	console.log('user info requested');
	const username = req.body.username.trim();

	User.findOne({ username : username }, (err, user) => {
		if (err) {res.status(400).json({errors:'user lookup failed'})};

		if (!user) {
			res.status(400).json({errors:'User not found'})
		} else {
			res.status(200).json(user);
		}
	})
});

router.post('/usersearch', function(req, res, next) {
	console.log('user search requested');
	const username = req.body.username.trim();

	if (!isValid(username)) {
		res.status(400).json({errors:'No matching users found'});
	} else {
		User.find({ username : new RegExp(username, "i") }, { username: 1 }, (err, users) => {
			if (err) {res.status(400).json({errors:'user lookup failed'})};

			if (users.length === 0) {
				res.status(400).json({errors:'No matching users found'})
			} else {
				const userIds = users.map(d => d._id);
				const results = users.map(d => ({_id:d._id, username:d.username,fins:[]}))

				Fin.find({ userId : {$in : userIds }}, (err, fins) => {
					if (err) {res.status(400).json({errors:'fin lookup failed'})};

					for (let i = 0; i < fins.length; i++){
						for (let j = 0; j < results.length; j++) {
							if (fins[i].userId == results[j]._id) {
								results[j].fins.push(fins[i]);
							}
						}
					}

					console.log(results);
					res.status(200).json(results);
				});
			}
		})
	}
});

router.use('/', (req, res) => {
  	res.status(400).end();
});

module.exports = router;