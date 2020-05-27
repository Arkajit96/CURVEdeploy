let config = require('dotenv').config().parsed;
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