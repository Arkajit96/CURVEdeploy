const Events = require('../models/events');

let eventsController = {};

eventsController.createEvent = (body) => {
    return new Promise(async (res, rej) => {
        let event = {
            calendarid: body.calendarid,
            foreignid: body.foreignid || null,
            start: {dateTime: body.start.dateTime},
            end: {dateTime: body.end.dateTime},
            summary: body.summary
        }
        Events.create(event).then((newEvent) => {
            res(newEvent);
        })
        .catch((e) => {
            console.log(e);
            rej(e);
        })
    })
}

eventsController.saveGoogleEvents = (calendarid, events) => {
    return new Promise(async (res, rej) => {
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

eventsController.saveMicrosoftEvents = (calendarid, events) => {
    return new Promise(async (res, rej) => {
        let savedEvents = await Events.find({calendarid: calendarid});
        let newEvents = events.filter(item => {
            let index = savedEvents.findIndex((el) => {
                return el.foreignid === item.id;
            })
            return index == -1;
        });

        let promiseArr = [];  
        newEvents.forEach((event) => {
            promiseArr.push(eventsController.createEvent({
                calendarid: calendarid,
                start:{dateTime: event.start.dateTime},
                end: {dateTime: event.end.dateTime},
                summary: event.summary,
                foreignid: event.id
            }))
        });
        Promise.all(promiseArr)
            .then((success) => {
                console.log(success);
                res(success);
            })
            .catch((e) => {
                console.log('ERROR');
                console.log(e);
                rej(e);
            })
    })
}

module.exports = eventsController;