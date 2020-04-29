var express = require("express");
var router = express.Router();

const calendarAuth = require("../middleware/calendarAuth");

// Controller
const calendarController = require('../controller/calendar');

router.get('/googleOath',calendarController.getGoogleAuthUrl)

router.get('/saveEvents',calendarController.saveEvents)

router.get('/getDatabaseEvents',calendarController.getDatabaseEvents)

router.get('/addEventsToDatabase',calendarController.addEventsToDatabase)

router.post('/getGoogleEvents',calendarAuth, calendarController.getGoogleEvents)

module.exports = router;