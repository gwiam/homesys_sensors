const mongoose = require('mongoose');
const EventSchema = new mongoose.Schema({
	eventType: {
		type: String,
		required: true
	},
	timestamp: {
		type: Date,
		required: true,
		default: Date.now
	}
});

module.exports = EventEntry = mongoose.model('Event', EventSchema);