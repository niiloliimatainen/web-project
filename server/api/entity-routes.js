const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const Entity = require('../models/Entity');
const validateToken = require('../auth/validateToken');
const Comment = require('../models/Comment');

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
				likedUsers: [],
				dislikedUsers: [],
				comments: [],
				modified: date,
			});

			newEntity.save((err, ent) => {
				if (err) return res.status(403).send({ success: false });
				user.entities = user.entities.concat([ent.id]);
				user.save((err) => {
					if (err) return res.status(403).send({ success: false });
					return res.send({ success: true });
				});
			});
		} else {
			return res.status(403).send({ success: false });
		}
	});
});

router.post('/vote', validateToken, (req, res) => {
	Entity.findById(req.body.id, (err, entity) => {
		if (err) return res.status(403).send({ success: false });
		if (entity) {
			if (req.body.like) {
				entity.likes = entity.likes + 1;
				entity.likedUsers = entity.likedUsers.concat([req.user.id]);
			} else {
				entity.dislikes = entity.dislikes + 1;
				entity.dislikedUsers = entity.dislikedUsers.concat([req.user.id]);
			}

			entity.save((err) => {
				if (err) return res.status(403).send({ success: false });
				return res.send({ success: true });
			});
		} else {
			return res.status(403).send({ success: false });
		}
	});
});

router.put('/update/:id', validateToken, (req, res) => {
	Entity.findById(req.params.id, (err, entity) => {
		if (err) return res.status(403).send({ success: false });
		if (entity) {
			const date = new Date(Date.now()).toLocaleString();
			const ent = req.body;
			entity.title = ent.title;
			entity.content = ent.content;
			entity.codeSnippet = ent.codeSnippet;
			entity.modified = date;
			entity.save((err) => {
				if (err) return res.status(403).send({ success: false });
				return res.send({ success: true });
			});
		} else {
			return res.status(403).send({ success: false });
		}
	});
});

router.get('/entities', (_req, res) => {
	Entity.find({}, (err, entities) => {
		if (err) return res.status(403).send({ success: false });
		if (entities) return res.send(entities);
		return res.sendStatus(204);
	});
});

router.get('/:id', (req, res) => {
	Entity.findById(req.params.id, (err, entity) => {
		if (err) return res.status(403).send({ success: false });
		if (entity) return res.send(entity);
	});
});

router.delete('/delete/:id', (req, res) => {
	Comment.deleteMany({ entity: req.params.id }, (err) => {
		if (err) return res.status(403).send({ success: false });
	});

	Entity.findByIdAndDelete(req.params.id, (err) => {
		if (err) return res.status(403).send({ success: false });
		return res.send({ success: true });
	});
});

module.exports = router;
