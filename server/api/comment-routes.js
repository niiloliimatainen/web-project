const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const Entity = require('../models/Entity');
const Comment = require('../models/Comment');
const validateToken = require('../auth/validateToken');

router.post('/:entityId', validateToken, (req, res) => {
	Users.findById(req.user.id, (err, user) => {
		if (!user || err) return res.status(403).send({ success: false });
		Entity.findById(req.params.entityId, (err, entity) => {
			if (!entity || err) return res.status(403).send({ success: false });
			createComment(req, res);
		});
	});
});

router.get('/:entityId', (req, res) => {
	Comment.find({ entity: req.params.entityId }, (err, comments) => {
		if (err) return res.status(403).send({ success: false });
		return res.send(comments);
	});
});

function createComment(req, res) {
	const date = new Date(Date.now()).toString();
	const newComment = new Comment({
		userId: req.user.id,
		username: req.user.username,
		entity: req.params.entityId,
		content: req.body.content,
		modified: date,
	});

	newComment.save((err, comment) => {
		if (err) return res.status(403).send({ success: false });
		saveUser(req.user.id, comment.id);
		saveEntity(req.params.entityId, comment.id);
		return res.send({ success: true });
	});
}

function saveUser(id, commentId) {
	Users.findById(id, (err, user) => {
		if (user && !err) {
			user.comments = user.comments.concat([commentId]);
			user.save((err) => {
				if (err) return res.status(403).send({ success: false });
			});
		}
	});
}

function saveEntity(id, commentId) {
	Entity.findOne({ _id: id }, (err, entity) => {
		if (entity && !err) {
			entity.comments = entity.comments.concat([commentId]);
			entity.save((err) => {
				if (err) return res.status(403).send({ success: false });
			});
		}
	});
}

module.exports = router;
