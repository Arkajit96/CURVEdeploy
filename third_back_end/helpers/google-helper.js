const { google } = require('googleapis');

require('dotenv').config()

// google app config
const googleConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirect: 'http://localhost:4200/redirect'
}

// scopes use for the application
const defaultScope = [
    'https://www.googleapis.com/auth/calendar.events.readonly',
    'profile',
    'email'
]

// oauth2 client
function createConnection() {
    return new google.auth.OAuth2(
        googleConfig.clientId,
        googleConfig.clientSecret,
        googleConfig.redirect
    );
}

// generate authentication url
function getConnectionUrl(auth) {
    return auth.generateAuthUrl({
        access_type: 'offline',
        prompt: 'consent',
        scope: defaultScope
    });
}


// get auth url
module.exports.urlGoogle = function () {
    const auth = createConnection();
    const url = getConnectionUrl(auth);
    return url;
}

// get oauth2 api
function getOAuth2(auth) {
    return google.oauth2({
        auth: auth,
        version: 'v2'
    });
}

module.exports.getGoogleAccountFromCode = async function (code, cb) {
    const auth = createConnection();
    const { tokens } = await auth.getToken(code);
    auth.setCredentials(tokens);
    const user = await getOAuth2(auth);
    user.userinfo.get((err, res) => {
        if (err) {
            cb(err);
        } else {
            const userProfile = {
                id: res.data.id,
                accessToken: tokens.access_token,
                name: res.data.name,
                displayPicture: res.data.picture,
                email: res.data.email
            }
            cb(null, userProfile);
        }
    })

}


// Google calendar utils
module.exports.listEvents = function (auth, cb) {
    const calendar = google.calendar({version: 'v3', auth});
    calendar.events.list({
      calendarId: 'primary',
      timeMin: (new Date()).toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    }, (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const events = res.data.items;
      if (events.length) {
          console.log(events);
        cb(events)
      } else {
        cb([])
        console.log('No upcoming events found.');
      }
    });
  }