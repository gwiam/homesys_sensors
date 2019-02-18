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
	switch(req.body.sortBy){
		case 0:
			// sort by latest
			EventEntry.find({eventType: "TempSensor"})
				.sort({timestamp: -1})
				.limit(req.body.limit)
			.then(entries => res.json(entries)
			);
			break;
		case 1:
			// sort by earliest today
			// sort by latest
			EventEntry.find({eventType: "TempSensor",
							timestamp: { $gte: (new Date()).setUTCHours(0,0,0,0)}})
				.sort({timestamp: 1})
				.limit(req.body.limit)
			.then(entries => res.json(entries)
			);
			break;
		case 2:
			// sort by earliest
			EventEntry.find({eventType: "TempSensor"})
				.sort({timestamp: 1})
				.limit(req.body.limit)
			.then(entries => res.json(entries)
			);
			break;
	}

})

module.exports = router;