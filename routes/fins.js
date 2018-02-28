const express = require('express');
const User = require('mongoose').model('users');
const Fin = require('mongoose').model('fins');
const router = express.Router();

router.post('/userfins', function(req, res, next) {

	console.log('request for user fins');

	const userId = req.body.userId.trim();

	Fin.find({userId : userId}, null, {sort: {time: -1}}, (err, fins) => {
		if (err) {res.status(400).json({errors:'fin lookup failed'})};
		res.status(200).json(fins);
	});
});

router.post('/addfin', function(req, res, next) {

	console.log('request to add fin');

	const userId = req.body.userId.trim();
	const title = req.body.title.trim();
	const imageUrl = req.body.imageUrl.trim();

	User.findOne({ _id: userId }, (err, user) => {
		if (err) {res.status(400).json({errors:'user lookup failed'})};

		const finData = {
			imageUrl: imageUrl,
			title: title,
			username: user.username,
			userId: userId,
			likes: [userId],
			refins: [],
			time: new Date()
		}

		const newFin = new Fin(finData);
		newFin.save((err) => {
			if (err) {res.status(400).json({errors:'add fin failed'})};

			Fin.find({userId : userId}, null, {sort: {time: -1}}, (err, fins) => {
				if (err) {res.status(400).json({errors:'fin lookup failed'})};
				res.status(200).json(fins);
			})
		})
	})
});

router.post('/deletefin', function(req, res, next) {

	console.log('request to delete fin');

	const finId = req.body.finId.trim();

	Fin.findOne({_id : finId}, (err, fin) => {
		if (err) {res.status(400).json({errors:'fin lookup failed'})};
		
		const userId = fin.userId;
		fin.remove();

		Fin.find({userId : userId}, null, {sort: {time: -1}}, (err, fins) => {
			if (err) {res.status(400).json({errors:'fin lookup failed'})};4

			let response = [];

	        for (let i = 0; i < fins.length; i++) {
		    	if (fins[i]._id != finId) {
			    	response.push(fins[i]);
		      	}
	        }

	        res.status(200).json(response);
		})
	})
});

router.post('/handlelike', function(req, res, next) {
	console.log('request to change like status');

	const finId = req.body.finId.trim();
	const userId = req.body.userId.trim();

	Fin.findOne({_id : finId}, (err, fin) => {
		if (err) {res.status(400).json({errors:'fin lookup failed'})};

		if (!fin) {
			res.status(400).json({errors:'Fin not found, it may have been deleted. Try refreshing the page.'})
		} else {
			if (fin.likes.indexOf(userId) === -1) {
				const likes = fin.likes.concat([]);
				likes.push(userId);

				Fin.update( { _id : finId}, {likes : likes}, (err, fin) => {
					if (err) {res.status(400).json({errors:'fin like flip failed'})};
					res.status(200).end();
				});
			} else {
				const likes = fin.likes.concat([]);
				likes.splice(fin.likes.indexOf(userId),1);

				Fin.update( { _id : finId}, {likes : likes}, (err, fin) => {
					if (err) {res.status(400).json({errors:'fin like flip failed'})};
					res.status(200).end();
				});
			}
		}
	});
});

router.post('/handlerefin', function(req, res, next) {
	console.log('request to re-fin');

	const finId = req.body.finId.trim();
	const userId = req.body.userId.trim();

	Fin.findOne({_id : finId}, (err, fin) => {
		if (err) {res.status(400).json({errors:'fin lookup failed'})};

		if (!fin) {
			res.status(400).json({errors:'Fin not found, it may have been deleted. Try refreshing the page.'})
		} else {

			const finData = {
				imageUrl: fin.imageUrl,
				userId: userId,
				likes: [userId],
				title: fin.title,
				refins: [],
				time: new Date()
			}

			const refins = fin.refins.concat([]);
			refins.push(userId);

			Fin.update( { _id : finId}, {refins : refins}, (err, fin) => {
				if (err) {res.status(400).json({errors:'fin like flip failed'})};

				User.findOne({ _id: userId }, (err, user) => {
					if (err) {res.status(400).json({errors:'user lookup failed'})};

					finData.username = user.username;
					const newFin = new Fin(finData);
					newFin.save((err) => {
						if (err) {res.status(400).json({errors:'add fin failed'})};
						res.status(200).end();
					})
				});
			});
		}
	});
});

router.get('/recentfins', function(req,res,next) {
	console.log('request for recent fins');

	Fin.find({}, null, {sort: {time: -1}, limit: 100}, (err, fins) => {
		if (err) {res.status(400).json({errors:'history lookup failed'})};
		res.status(200).json(fins);
	});
});

router.use('/', (req, res) => {
  	res.status(400).end();
});

module.exports = router;