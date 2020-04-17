const { google } = require('googleapis');

const {listEvents} = require('../helpers/google-util')
const googleUtil = require('../helpers/google-util');

exports.getGoogleAuthUrl = (req, res) => {
    url = googleUtil.urlGoogle()
    if (url) {
        res.status(200).json({
            message: 'Please login with google account',
            url: url
        })
    }else{
        res.status(500).json({
            message: "Error occoured",
            url: ''
        });
    }
}

exports.getCalendarEvents = (req, res) => {
    
    // check for valid session
    if (req.session.calenderUser) {
        // console.log(req.session.calenderUser);

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
                events: data
            })
        });
        
    } else {
        res.status(401).json({
            message: 'get Event failed',
            events: null
        })
    }
}