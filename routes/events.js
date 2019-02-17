const express = require('express');
const router = express.Router();

// Event models

const EventEntry = require('../models/EventEntry');

// @route GET /events
// @desc Get all events happened
router.get('/', (req, res) => {
	EventEntry.find({eventType: "TempSensor"})
		.sort({timestamp: 1})
		.then(entries => res.json(entries)
	)
});

// @route POST /events
// @desc post a new event to db
router.post("/", (req, res) => {
	const newEvent = new EventEntry({
		eventType: req.body.type
	});

	newEvent.save().then(entry => res.json(entry));
})

module.exports = router;