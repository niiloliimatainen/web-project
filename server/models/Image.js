const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Image that user can add for profile
let imageSchema = new Schema({
	userId: String,
	name: String,
	encoding: String,
	mimetype: String,
	buffer: Buffer,
});

module.exports = mongoose.model('image', imageSchema);
