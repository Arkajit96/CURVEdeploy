let config = require('dotenv').config().parsed;
const rightConfig = require('./config');
let express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
   //  flash       = require("connect-flash"),
   //  passport    = require("passport"),
   //  LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Blog  = require("./models/blog"),
    Comment     = require("./models/comment"),
    User       = require("./models/user"),
    http = require('http');
    cors = require('cors')

 //session
const session = require('express-session');
   
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const ioListener = require('./controller/io');
   //  port        = 9292;
ioListener.setIO(io);
   
const PORT = process.env.PORT || 3000;

// MICROSOFT SIGN IN
const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

// const oauth2 = require('simple-oauth2').create({
//    client: {
//      id: rightConfig.MICROSOFT_APP_ID,
//      secret: rightConfig.MICROSOFT_SECRET
//    },
//    auth: {
//      tokenHost: process.env.OAUTH_AUTHORITY,
//      authorizePath: process.env.OAUTH_AUTHORIZE_ENDPOINT,
//      tokenPath: process.env.OAUTH_TOKEN_ENDPOINT
//    }
//  });

 // Callback function called once the sign-in is complete
// and an access token has been obtained
// <SignInCompleteSnippet>
async function signInComplete(iss, sub, profile, accessToken, refreshToken, params, done) {
   if (!profile.oid) {
     return done(new Error("No OID found in user profile."));
   }
 
   // try{
   // //   const user = await graph.getUserDetails(accessToken);
 
   //   if (user) {
   //     // Add properties to profile
   //     profile['email'] = user.mail ? user.mail : user.userPrincipalName;
   //   }
   // } catch (err) {
   //   return done(err);
   // }
 
   // Create a simple-oauth2 token from raw tokens
   // let oauthToken = oauth2.accessToken.create(params);
 
   // Save the profile and tokens in user storage
   // users[profile.oid] = { profile, oauthToken };
   return done(null, users[profile.oid]);
 }
 // </SignInCompleteSnippet>
 
//  Configure OIDC strategy
 passport.use(new OIDCStrategy(
   {
     identityMetadata: `${rightConfig.MICROSOFT_AUTHORITY}${rightConfig.MICROSOFT_ID_METADATA}`,
     clientID: rightConfig.MICROSOFT_APP_ID,
     responseType: 'code id_token',
     responseMode: 'form_post',
     redirectUrl: rightConfig.MICROSOFT_REDIRECT_URI,
     allowHttpForRedirectUrl: true,
     clientSecret: rightConfig.MICROSOFT_SECRET,
     validateIssuer: false,
     passReqToCallback: false,
     scope: rightConfig.MICROSOFT_SCOPES.split(' ')
   },
   signInComplete
 ));
    
//requiring routes
const indexRoutes = require("./routes/index"),
      studentRoutes = require("./routes/student"),
      facultyRoutes = require("./routes/faculty"),
      messageRoutes = require("./routes/messages")
      researchRoutes = require("./routes/research");
      calendarRoutes = require("./routes/calendar");
      eventRoutes = require('./routes/events');
      microsoftRoutes = require('./routes/microsoft');
 
// let uri = "mongodb+srv://yueningzhu505:volunteer123@cluster0-9ccmb.mongodb.net/curve?retryWrites=true";

//mongodb connection
const mongoDB = ("mongodb+srv://"+
                 config.USERNAME+
                 ":"
                 +config.PASSWORD+
                 "@"
                 +config.HOST+
                 "/"
                 +config.DATABASE);
                 
mongoose.connect(mongoDB, 
   {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
   })
   .then((data) => {
      // console.log('CONNECTED TO MONGODB');
   })
   .catch((e) => {
      console.log('ERROR');
      console.log(e);
   });

//bodyParse setting
app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({extended: true, limit: '50mb', parameterLimit: 1000000}));


// app.use(express.bodyParser({limit: '50mb'}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


// express-session config
app.use(
   session({
     name: 'curve',
     saveUninitialized: false,
     resave: false,
     secret: process.env.SECRETKEY,
     cookie: {
       maxAge: 1000 * 60 * 60 * 2,
       sameSite: true
     }
   })
 )

 app.use(function(req, res, next) {
   res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   next();
 });

app.use("/", indexRoutes);
app.use("/student", studentRoutes);
app.use("/faculty", facultyRoutes);
app.use("/message", messageRoutes);
app.use("/research", researchRoutes);
app.use("/calendar", calendarRoutes)
app.use("/events", eventRoutes);
app.use("/microsoft", microsoftRoutes);

const listener = server.listen(PORT, function() {
   console.log(`Your app is listening on port ${PORT}`);
})

module.exports = io;