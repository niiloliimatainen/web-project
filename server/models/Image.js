const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let imageSchema = new Schema({
	userId: String,
	name: String,
	encoding: String,
	mimetype: String,
	buffer: Buffer,
});

module.exports = mongoose.model('image', imageSchema);
