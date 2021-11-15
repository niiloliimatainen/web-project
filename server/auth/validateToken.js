const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
	const authHeader = req.headers['authorization'];
	let token = null;
	if (authHeader) {
		token = authHeader.split(' ')[1];
	}
	if (token === null) return res.status(401).send('Unauthorized');

	jwt.verify(token, process.env.SECRET, (err, user) => {
		if (err) return res.sendStatus(403);
		req.user = user;
		next();
	});
};
