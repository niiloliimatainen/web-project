const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

let usersSchema = new Schema({
	email: String,
	username: String,
	password: String,
	entities: Array,
	comments: Array,
	imageId: String,
});

const Users = mongoose.model('users', usersSchema);

Users.findOne({ username: 'admin' }, (err, admin) => {
	if (err) throw err;
	if (!admin) {
		bcrypt.genSalt(10, (err, salt) => {
			if (err) throw err;
			bcrypt.hash('Adm1nAdm1n!', salt, (err, hash) => {
				if (err) throw err;
				const newUser = new Users({
					email: 'admin@app.com',
					username: 'admin',
					password: hash,
					entities: [],
					comments: [],
					imageId: '',
				});

				newUser.save((err) => {
					if (err) throw err;
				});
			});
		});
	}
});

module.exports = Users;
