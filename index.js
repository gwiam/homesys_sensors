const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const events = require('./routes/events');
const app = express();

// Body parser for requests
app.use(bodyParser.json());

// DB connection address
const dbConfig = require("./config/keys").mongoURI;

// Use routes
app.use('/events', events);

// server port
const port = process.env.port || 8080;

// connect to db
mongoose.connect(dbConfig, {useNewUrlParser: true})
	.then(() => console.log("Connection to database established."))
	.catch(err => console.log(err));

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});