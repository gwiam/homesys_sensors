const express = require('express');
const router = express.Router();

// Event models

const EventEntry = require('../models/EventEntry');

// @route GET /events
// @desc Get all events happened
router.get('/', (req, res) => {
	EventEntry.find({eventType: "TempSensor"})
		.sort({timestamp: 1})
		.limit(80)
		.then(entries => res.json(entries)
	)
});

// @route POST /events
// @desc post a new event to db
router.post("/", (req, res) => {
	if (req.body.ignoreDate){
		//without date limits
		EventEntry.find({eventType: "TempSensor"})
			.sort({timestamp: req.body.sortBy})
			.limit(req.body.limit) // 0 is no limit
			.then(entries => res.json(entries)
		);
	}else{
		EventEntry.find({eventType: "TempSensor",
						 timestamp: { $gte: (new Date(req.body.date)).setUTCHours(0,0,0,0)}})
			.sort({timestamp: req.body.sortBy})
			.limit(req.body.limit)
			.then(entries => res.json(entries)
		);
	}
})

module.exports = router;