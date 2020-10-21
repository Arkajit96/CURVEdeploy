var async = require('async');
var mongoose = require("mongoose");

// helper for google 
const { google } = require('googleapis');
const googleUtil = require('../helpers/google-helper');
const { listEvents } = require('../helpers/google-helper')

// helper for the iCloud
// const promptiCloud = require('../helpers/iCloud-helper');
const { ICloudCalendar,LanguageLocales, TimeZones} = require('icloud-calendar');
var prompt = require('prompt');


// Model
const Events = require('../models/events');

exports.getGoogleAuthUrl = (req, res) => {
    url = googleUtil.urlGoogle()
    if (url) {
        res.status(200).json({
            message: 'Please login with google account',
            url: url
        })
    } else {
        res.status(500).json({
            message: "Error occoured",
            url: ''
        });
    }
}

exports.getGoogleEvents = (req, res) => {

    // check for valid session
    if (req.session.calenderUser) {

        // get oauth2 client
        const oauth2Client = new google.auth.OAuth2();
        oauth2Client.setCredentials({
            access_token: req.session.calenderUser.accessToken
        });

        // get calendar events by passing oauth2 client
        listEvents(oauth2Client, (events) => {
            const data = {
                name: req.session.calenderUser.name,
                displayPicture: req.session.calenderUser.displayPicture,
                id: req.session.calenderUser.id,
                email: req.session.calenderUser.email,
                events: events
            }

            res.status(200).json({
                message: 'get Event successful',
                userData: data
            })
        });

    } else {
        res.status(401).json({
            message: 'get Event failed',
            userData: null
        })
    }
}


// create multiple applications (or update if it is already there)
exports.saveEvents = (req, res) => {

    let filter = {
        userid: req.body.userId,
        source: req.body.source
    };

    const config = {
        upsert: true,
        setDefaultsOnInsert: true
    };

    async.each(req.body.events, (event, cb) => {

        const update = {
            start: { dateTime: event.start.dateTime },
            end: { dateTime: event.end.dateTime },
            summary: event.summary,
            organizor: event.organizer
        }

        filter.calendarid = event.id;

        Events.findOneAndUpdate(filter, update, config, (err, savedEvents) => {
            if (err) {
                return cb(err);

            } else {
                return cb()

            }
        })
    }, err => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "Events save failed!"
            });
        } else {
            res.status(200).json({
                message: 'Events save successful'
            })
        }
    })
}

exports.getDatabaseEvents = (req, res) => {
    let userId = mongoose.Types.ObjectId(req.params.userId);
    Events.find({ userid: userId })
        .then(events => {
            res.status(200).json({
                message: 'Fetching events successfully',
                events: events
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "Fetching events failed!",
                events: []
            });
        });
}

exports.addEventsToDatabase = (req, res) => {
    const filter = {
        calendarid: req.body.userId,
    };

    const update = req.body.events;

    const config = {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
    };

    // if find the old application then update the files and time
    Events.findOneAndUpdate(filter, update, config, (err, newEvent) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "Event create failed!",
                event: null
            });
        } else {
            res.status(200).json({
                message: 'Event create successful',
                applicationID: newEvent
            })
        }
    })
}


exports.getICloudEvents = async (req, res) => {
    const calendar = new ICloudCalendar();

    const startTime = req.query.start;
    const endTime = req.query.end;

    prompt.start();

    prompt.get({
        properties: {
            username: {
                pattern: /^.*$/,
                message: 'Mail',
                required: false
            },
            password: {
                required: false,
                hidden: true
            }
        }
    }, function (err, input) {
        if (err) return console.error(err);
        calendar.login(input.username, input.password).then(resp => {
            calendar.getEvents(LanguageLocales["en-US"], TimeZones["America/New_York"], startTime, endTime).then(calendars => {
                console.log(calendars);
            }).catch(err => {
                console.error(err);
            });
        }).catch(err => {
            console.error(err);
        });
    })



    // var events = await myCloud.Calendar.getEvents(startTime, endTime);

    // console.log(events);

    // if(!events){ 
    //     res.status(500).json({
    //         message: "Icloud event fetching failed!",
    //         event: null
    //     });
    // }else{
    //     res.status(200).json({
    //         message: 'Icloud event fetching successful',
    //         applicationID: events
    //     })
    // }
}
