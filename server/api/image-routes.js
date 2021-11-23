const express = require('express');
const Image = require('../models/Image');
const Users = require('../models/Users');
const multer = require('multer');
const upload = multer();
const router = express.Router();
const validateToken = require('../auth/validateToken');

router.post('/', upload.single('image'), (req, res) => {
	Users.findById(req.body.userId, (err, user) => {
		if (user && !err) {
			const img = req.file;
			const newImage = new Image({
				userId: req.body.userId,
				name: img.originalname,
				encoding: img.encoding,
				mimetype: img.mimetype,
				buffer: img.buffer,
			});

			newImage.save((err, img) => {
				if (err) throw err;
				user.imageId = img.id;
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

router.get('/:userId', (req, res) => {
	Image.findOne({ userId: req.params.userId }, (err, img) => {
		if (err) throw err;
		else if (img) {
			res
				.header('Content-Type', img.mimetype)
				.header('Content-Disposition', `inline; filename="${img.name}"`)
				.send(img.buffer);
		} else {
			return res.status(404).send('Not found');
		}
	});
});

module.exports = router;
