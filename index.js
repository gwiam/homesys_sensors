const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const events = require('./routes/events');
const app = express();

// Body parser for requests
app.use(bodyParser.json());

// DB connection address
const dbConfig = require("./config/keys").mongoURI;

// Use routes
app.use('/events', events);

// Serve in production environment
if (process.env.NODE_ENV === 'production'){

	app.use(express.static('client/build'));
	// we are in production, point to client/build path
	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}
// server port
const port = process.env.port || 8080;

// connect to db
mongoose.connect(dbConfig, {useNewUrlParser: true})
	.then(() => console.log("Connection to database established."))
	.catch(err => console.log(err));

app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});