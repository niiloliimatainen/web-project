const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Entity is main object in this app and it is always made by user.
//It includes title, text content and the code-snippet. Different users can comment on it and vote it.
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
