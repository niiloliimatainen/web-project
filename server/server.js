require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 1234;
const path = require("path");
const userRoutes = require("./api/user-routes");

const mongoDB = "mongodb://localhost:27017/testdb";
mongoose.connect(mongoDB);
mongoose.Promise = Promise;
const db = mongoose.connection;

db.once("open", function () {
	console.log("MongoDB database connection established successfully!");
});
db.on("error", console.error.bind(console, "MongoDB connection error"));

app.use(express.json());

router.get("/moi", (req, res) => {
	return res.send({ testi: "moi" });
});

// app.get("/", (req, res) => {
// 	res.sendFile(path.join(__dirname + "/public/index.html"));
// });

app.use("/api", userRoutes);

// app.use(express.static(path.join(__dirname, "public")));

app.use("*", (req, res) => {
	res.status(404).send("what???");
});

app.listen(port, () => console.log(`Server listening a port ${port}!`));
