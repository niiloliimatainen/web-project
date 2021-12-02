const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const validateToken = require('../auth/validateToken');

// All endpoints to handle requests related to user

// Email and password must pass the requirements, username and email must be unique
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
					if (err) return res.status(403).send({ success: false });
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

// User can login with email or with username. If user is admin, add isAdmin=true to return body.
router.post('/login', (req, res) => {
	Users.findOne(
		{ $or: [{ email: req.body.username }, { username: req.body.username }] },
		(err, user) => {
			if (err) return res.status(403).send({ success: false });
			if (user) {
				bcrypt.compare(req.body.password, user.password, (err, match) => {
					if (err || !match) return res.status(404).send({ success: false });
					const jwtPayload = {
						id: user._id,
						email: user.email,
						username: user.username,
					};
					jwt.sign(jwtPayload, process.env.SECRET, (err, token) => {
						if (err) return res.status(403).send({ success: false });
						let isAdmin = false;
						if (user.username === 'admin') isAdmin = true;
						return res.status(200).send({
							success: true,
							userId: user._id,
							admin: isAdmin,
							token,
						});
					});
				});
			} else return res.status(403).send({ success: false });
		}
	);
});

// Get user by id
router.get('/:id', (req, res) => {
	Users.findOne({ _id: req.params.id }, (err, user) => {
		if (err) return res.status(403).send({ success: false });
		if (user) return res.send(user);
	});
});

// Get user's bio by userId
router.put('/:id/bio', validateToken, (req, res) => {
	Users.findById(req.user.id, (err, user) => {
		if (err) return res.status(403).send({ success: false });
		if (user) {
			user.bio = req.body.content;
			user.save((err) => {
				if (err) return res.status(403).send({ success: false });
				return res.send({ success: true });
			});
		} else {
			return res.status(403).send({ success: false });
		}
	});
});

// Helper function for registration. Initialize user's metadata.
function createUser(req, res) {
	bcrypt.genSalt(10, (err, salt) => {
		if (err) return res.status(403).send({ success: false });
		bcrypt.hash(req.body.password, salt, (err, hash) => {
			if (err) return res.status(403).send({ success: false });
			const date = new Date(Date.now()).toLocaleString();
			const newUser = new Users({
				email: req.body.email,
				username: req.body.username,
				password: hash,
				entities: [],
				comments: [],
				imageId: '',
				registerDate: date,
				bio: '',
			});
			newUser.save((err, user) => {
				if (err) return res.status(403).send({ success: false });
				return res.send({
					success: true,
					userId: user.id,
				});
			});
		});
	});
}

module.exports = router;
