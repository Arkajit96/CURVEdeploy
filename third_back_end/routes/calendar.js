var express = require("express");
var router = express.Router();

const calendarAuth = require("../middleware/calendarAuth");

// Controller
const calendarController = require('../controller/calendar');

router.get('/googleOath',calendarController.getGoogleAuthUrl)

router.post('/getGoogleEvents',calendarAuth, calendarController.getCalendarEvents)

module.exports = router;