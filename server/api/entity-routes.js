const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const Entity = require('../models/Entity');
const validateToken = require('../auth/validateToken');

router.post('', validateToken, (req, res) => {
	const ent = req.body;
	const newEntity = new Entity({
		title: ent.title,
		content: ent.content,
		codeSnippet: ent.codeSnippet,
		likes: ent.likes,
		dislikes: ent.dislikes,
		comments: [],
		modified: Date.now(),
	});

	newEntity.save((err, ent) => {
		if (err) throw err;
		Users.findOne({ user: req.user.id }, (err, user) => {
			if (err) throw err;
			if (user) {
				user.entities = user.entities.concat([ent.id]);
				user.save((err) => {
					if (err) throw err;
				});
			} else return res.status(403).send({ success: false });
		});
	});
	return res.send({ success: true });
});

router.get('/entities', (_req, res) => {
	Entity.find({}, (err, entities) => {
		if (err) throw err;
		if (entities) return res.send(entities);
		return res.sendStatus(204);
	});
});

router.get('/:id', (req, res) => {
	Entity.findOne({ id: req.params.id }, (err, entity) => {
		if (err) throw err;
		if (entity) return res.send(entity);
	});
});

router.post('/comment', validateToken, (req, res) => {
	return res.sendStatus(200);
});

router.get('/comments', (req, res) => {
	return res.sendStatus(200);
});

module.exports = router;
