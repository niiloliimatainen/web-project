const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const Todo = require('../models/Todo');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

router.post(
	'/user/register',
	body('email').isEmail(),
	body('password').isStrongPassword(),
	(req, res, next) => {
		if (!validationResult(req).isEmpty()) {
			res.status(400).send(validationResult(req));
		} else {
			Users.findOne({ email: req.body.email }, (err, user) => {
				if (err) return next(err);
				if (!user) {
					createUser(req, res);
				} else {
					return res.status(403).send('Email already in use.');
				}
			});
		}
	}
);

router.post('/user/login', (req, res, next) => {
	Users.findOne({ email: req.body.email }, (err, user) => {
		if (err) return next(err);
		if (user) {
			console.log('no moi');
			bcrypt.compare(req.body.password, user.password, (err, match) => {
				if (err) throw err;
				if (!match) {
					return res.status(403).send({ success: false });
				} else {
					const jwtPayload = {
						id: user._id,
						email: user.email,
					};
					jwt.sign(jwtPayload, process.env.SECRET, (err, token) => {
						return res.status(200).send({ success: true, token });
					});
				}
			});
		} else {
			console.log('täh');
			return res.status(403).send({ success: false });
		}
	});
});

router.post('/todos', (req, res) => {
	const authHeader = req.headers.authorization;
	let token = null;
	if (authHeader) token = authHeader.split(' ')[1];
	if (token === null) {
		return res.status(401).send('Unauthorized');
	} else {
		jwt.verify(token, process.env.SECRET, (err, user) => {
			if (err) return res.status(401).send('Unauthorized');
			else addTodo(req, res, user);
		});
	}
});

router.get('/private', (req, res) => {
	const authHeader = req.headers.authorization;
	let token = null;
	if (authHeader) token = authHeader.split(' ')[1];
	if (token === null) {
		return res.status(401).send('Unauthorized');
	} else {
		jwt.verify(token, process.env.SECRET, (err, user) => {
			if (err) return res.status(401).send('Unauthorized');
			else res.send({ email: user.email });
		});
	}
});

router.get('/todos', (req, res) => {
	const authHeader = req.headers.authorization;
	let token = null;
	if (authHeader) token = authHeader.split(' ')[1];
	if (token === null) {
		return res.status(401).send('Unauthorized');
	} else {
		jwt.verify(token, process.env.SECRET, (err, user) => {
			if (err) {
				return res.status(401).send('Unauthorized');
			} else {
				Todo.findOne({ user: user.id }, (err, todo) => {
					if (err) return next(err);
					if (todo) {
						return res.send({ items: todo.items });
					} else {
						return res.status(201).send('No todos');
					}
				});
			}
		});
	}
});

function addTodo(req, res, user) {
	Todo.findOne({ user: user.id }, (err, todo) => {
		if (err) return next(err);
		if (todo) {
			todo.items = todo.items.concat(req.body.items);
			todo.save((err) => {
				if (err) return res.status(403).send({ success: false });
				return res.send('ok');
			});
		} else {
			const newTodo = new Todo({
				user: user.id,
				items: req.body.items,
			});

			newTodo.save((err) => {
				if (err) return res.status(403).send({ success: false });
				return res.send('ok');
			});
		}
	});
}

function createUser(req, res) {
	bcrypt.genSalt(10, (err, salt) => {
		if (err) throw err;
		bcrypt.hash(req.body.password, salt, (err, hash) => {
			if (err) throw err;
			const newUser = new Users({
				email: req.body.email,
				password: hash,
			});
			newUser.save((err) => {
				if (err) throw err;
				return res.send({ success: true });
			});
		});
	});
}

module.exports = router;
