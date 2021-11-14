const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

router.post(
	'/register',
	body('email').isEmail(),
	body('password').isStrongPassword(),
	(req, res) => {
		if (!validationResult(req).isEmpty()) {
			res.status(400).send(validationResult(req));
		} else {
			Users.findOne(
				{ $or: [{ email: req.body.email }, { username: req.body.username }] },
				(err, user) => {
					if (err) throw err;
					if (!user) {
						createUser(req, res);
					} else if (user.email === req.body.email) {
						return res.status(403).send('Email already in use.');
					} else if (user.username === req.body.username) {
						return res.status(404).send('Username already in use.');
					}
				}
			);
		}
	}
);

router.post('/login', (req, res) => {
	Users.findOne(
		{ $or: [{ email: req.body.username }, { username: req.body.username }] },
		(err, user) => {
			if (err) throw err;
			if (user) {
				bcrypt.compare(req.body.password, user.password, (err, match) => {
					if (err || !match) return res.status(404).send({ success: false });
					const jwtPayload = {
						id: user._id,
						email: user.email,
					};
					jwt.sign(jwtPayload, process.env.SECRET, (err, token) => {
						if (err) throw err;
						return res.status(200).send({ success: true, token });
					});
				});
			} else return res.status(403).send({ success: false });
		}
	);
});

router.get('/:id', (req, res) => {
	Users.findOne({ _id: req.params.id }, (err, user) => {
		if (err) throw err;
		if (user) return res.send(user);
	});
});

function createUser(req, res) {
	bcrypt.genSalt(10, (err, salt) => {
		if (err) throw err;
		bcrypt.hash(req.body.password, salt, (err, hash) => {
			if (err) throw err;
			const newUser = new Users({
				email: req.body.email,
				username: req.body.username,
				password: hash,
				entities: [],
				comments: [],
			});
			newUser.save((err) => {
				if (err) throw err;
				return res.send({ success: true });
			});
		});
	});
}

module.exports = router;
