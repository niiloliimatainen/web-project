const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let commentSchema = new Schema({
	user: String,
	entity: String,
	comment: String,
	modified: String,
});

module.exports = mongoose.model('comment', commentSchema);
