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
      console.log('CONNECTED TO MONGODB');
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

app.use("/", indexRoutes);
app.use("/student", studentRoutes);
app.use("/faculty", facultyRoutes);
app.use("/message", messageRoutes);
app.use("/research", researchRoutes);

const listener = server.listen(PORT, function() {
   console.log(`Your app is listening on port ${PORT}`);
})

module.exports = io;