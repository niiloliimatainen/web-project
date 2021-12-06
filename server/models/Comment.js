const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Comment that can be added by user to the entity
let commentSchema = new Schema({
	userId: String,
	username: String,
	entity: String,
	content: String,
	modified: String,
});

module.exports = mongoose.model('comment', commentSchema);
