const jwt = require('jsonwebtoken');

// Interceptor function to validate user's jwt token. If token is valid, add user to the request and go to the next step, else return 401.
module.exports = function (req, res, next) {
	const authHeader = req.headers['authorization'];
	let token = null;
	if (authHeader) {
		token = authHeader.split(' ')[1];
	}
	if (token === null) return res.status(401).send('Unauthorized');

	jwt.verify(token, process.env.SECRET, (err, user) => {
		if (err) return res.status(403).send({ success: false });
		req.user = user;
		next();
	});
};
