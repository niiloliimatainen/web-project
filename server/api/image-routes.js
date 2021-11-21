const express = require('express');
const Image = require('../models/Image');
const Users = require('../models/Users');
const multer = require('multer');
const upload = multer();
const router = express.Router();
const validateToken = require('../auth/validateToken');

router.post('/', validateToken, upload.single('image'), (req, res, next) => {
	Users.findById(req.user.id, (err, user) => {
		if (user && !err) {
			console.log(req.file);
			const img = req.file;

			const newImage = new Image({
				userId: req.user.id,
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

router.get('/', (req, res, next) => {
	Image.findById(req.user.id, (err, img) => {
		if (err) {
			return next(err);
		}
		if (img.length > 0) {
			res
				.header('Content-Type', img[0].mimetype)
				.header('Content-Disposition', `inline; filename="${img[0].name}"`)
				.send(img[0].buffer);
		} else {
			return res.status(404).send('Not found');
		}
	});
});

module.exports = router;
