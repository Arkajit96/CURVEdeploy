var express = require("express");
var router = express.Router();

// Middleware
const calendarAuth = require("../middleware/calendarAuth");
const checkAuth = require("../middleware/check-auth");

// Controller
const calendarController = require('../controller/calendar');

router.get('/googleOath',checkAuth,calendarController.getGoogleAuthUrl)

router.post('/saveEvents',checkAuth,calendarController.saveEvents)

router.get('/getDatabaseEvents/:userId',checkAuth,calendarController.getDatabaseEvents)

router.get('/addEventsToDatabase',checkAuth,calendarController.addEventsToDatabase)

router.post('/getGoogleEvents',checkAuth,calendarAuth, calendarController.getGoogleEvents)

//iCloud calendar
router.get('/getICloudEvents',checkAuth,calendarController.getICloudEvents)

module.exports = router;