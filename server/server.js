require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = 1234;
const userRoutes = require('./api/user-routes');
const entityRoutes = require('./api/entity-routes.js');
const commentRoutes = require('./api/comment-routes.js');

const mongoDB = 'mongodb://localhost:27017/testdb';
mongoose.connect(mongoDB);
mongoose.Promise = Promise;
const db = mongoose.connection;

db.once('open', function () {
	console.log('MongoDB database connection established successfully!');
});

db.on('error', console.error.bind(console, 'MongoDB connection error'));

app.use(express.json());

app.use('/api/user', userRoutes);

app.use('/api/entity', entityRoutes);

app.use('/api/comment', commentRoutes);

app.use('*', (req, res) => {
	res.status(404).send('Invalid url');
});

app.listen(port, () => console.log(`Server listening a port ${port}!`));
