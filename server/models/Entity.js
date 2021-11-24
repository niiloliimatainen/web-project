const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let entitySchema = new Schema({
	userId: String,
	username: String,
	title: String,
	content: String,
	codeSnippet: String,
	modified: String,
	comments: Array,
	likes: Number,
	dislikes: Number,
	likedUsers: Array,
	dislikedUsers: Array,
});

module.exports = mongoose.model('entity', entitySchema);
