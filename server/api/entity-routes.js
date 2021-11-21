const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const Entity = require('../models/Entity');
const validateToken = require('../auth/validateToken');

router.post('', validateToken, (req, res) => {
	Users.findById(req.user.id, (err, user) => {
		if (user && !err) {
			const ent = req.body;
			const date = new Date(Date.now()).toLocaleString();
			const newEntity = new Entity({
				userId: req.user.id,
				username: req.user.username,
				title: ent.title,
				content: ent.content,
				codeSnippet: ent.codeSnippet,
				likes: 0,
				dislikes: 0,
				comments: [],
				modified: date,
			});

			newEntity.save((err, ent) => {
				if (err) throw err;
				user.entities = user.entities.concat([ent.id]);
				user.save((err) => {
					if (err) throw err;
					return res.send({ success: true });
				});
			});
		} else {
			return res.status(403).send({ success: false });
		}
	});
});

router.get('/entities', (_req, res) => {
	Entity.find({}, (err, entities) => {
		if (err) throw err;
		if (entities) return res.send(entities);
		return res.sendStatus(204);
	});
});

router.get('/:id', (req, res) => {
	Entity.findById(req.params.id, (err, entity) => {
		if (err) throw err;
		if (entity) return res.send(entity);
	});
});

module.exports = router;
