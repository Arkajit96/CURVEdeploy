const events = require('../models/events');

let eventsController = {};

eventsController.createEvent = (body) => {
    return new Promise(async (res, rej) => {
        let event = {
            calendarid: body.calendarid,
            start: {dateTime: body.start.dateTime},
            end: {dateTime: body.end.dateTime},
            summary: body.summary
        }
        events.create(event).then((newEvent) => {
            res(newEvent);
        })
        .catch((e) => {
            console.log(e);
            rej(e);
        })
    })
}

eventsController.saveGoogleEvents = (calendarid, events) => {
    return new Promise(async (req, res) => {
        let promiseArr = [];
        events.events.forEach(event => {
            promiseArr.push(eventsController.createEvent({
                calendarid: calendarid,
                start: {dateTime: event.start.dateTime},
                end: {dateTime: event.end.dateTime},
                summary: event.summary
            }));
        });
        Promise.all(promiseArr)
            .then((data) => {
                // console.log(data);
                res(data);
            })
            .catch((e) => {
                console.log(e);
                rej(e);
            })
    })
}

module.exports = eventsController;