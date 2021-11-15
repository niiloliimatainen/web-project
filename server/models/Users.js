const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let usersSchema = new Schema({
	email: String,
	username: String,
	password: String,
	entities: Array,
	comments: Array,
});

module.exports = mongoose.model('users', usersSchema);
