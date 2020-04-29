const express = require("express");
const router  = express.Router();
const eventController = require('../controller/eventController');

// Model
const events = require('../models/events');

// Middleware
const checkAuth = require("../middleware/check-auth");

// Routes
router.post('/create', checkAuth, async (req, res) => {
    eventController.createEvent(req.body)
        .then((newEvent) => {
            res.send(newEvent);
        })
        .catch((e) => {
            console.log(e);
            res.send({error: "Could not create event"});
        });
});

router.get('/:calendarid', checkAuth, async (req, res) => {
    const calendarid = req.params.calendarid;
    let userEvents = await events.find({calendarid: calendarid});
    res.send(userEvents);
})

router.post('/saveGoogleEvents', checkAuth, async (req, res) => {
    const calendarid = req.body.calendarid;
    const events = req.body.events;
    // console.log(this.eventController)
    eventController.saveGoogleEvents(calendarid, events)
        .then((data) => {
            // console.log(data);
            res.send({'success': 'Saved google events'});
        })
        .catch((e) => {
            console.log(e);
            res.send({'error': 'Could not save google events'});
        })
})

module.exports = router;