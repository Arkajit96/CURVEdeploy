const mongoose = require("mongoose");

const eventsSchema = new mongoose.Schema({
    calendarid: {
        type: String
    },
    userid: {
        type: String
    },
    source: {
        type: String
    },
    start: {
        type: Object,
        dateTime: {
            type: String
        }
    },
    end: {
        type: Object,
        dateTime: {
            type: String
        }
    },
    summary: {
        type: String
    }
});

module.exports = mongoose.model("Events", eventsSchema);