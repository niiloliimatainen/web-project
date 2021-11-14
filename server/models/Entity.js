const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let entitySchema = new Schema({
	user: String,
	title: String,
	content: String,
	codeSnippet: String,
	modified: String,
	comments: Array,
	likes: Number,
	dislikes: Number,
});

module.exports = mongoose.model('entity', entitySchema);
