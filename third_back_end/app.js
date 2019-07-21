require('dotenv').config();
var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Blog  = require("./models/blog"),
    Comment     = require("./models/comment"),
    User       = require("./models/User")
   //  port        = 9292;
    
//requiring routes
var indexRoutes = require("./routes/index"),
   studentRoutes = require("./routes/student"),
   facultyRoutes = require("./routes/faculty")
 
// var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v10";
// var uri = 'mongodb://JamesLin:<Lin!960605>@cluster0-x6qm9.mongodb.net/travelBlog?retryWrites=true'
// mongoose.connect(uri);
console.log(process.env.USERNAME)
const mongoDB = ("mongodb+srv://"+
                 process.env.USERNAME+
                 ":"
                 +process.env.PASSWORD+
                 "@"
                 +process.env.HOST+
                 "/"
                 +process.env.DATABASE);
mongoose.connect(mongoDB, {useNewUrlParser: true, retryWrites: true});



app.use(bodyParser.urlencoded({extended: true, limit: '50mb'}));
// app.use(express.bodyParser({limit: '50mb'}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    User.authenticate()
        // function(username, password, done) {
        //   User.findOne({ username: username }, function(err, user) {
        //     if (err) { 
        //         console.log("1");
        //         return done(err); }
        //     if (!user) {
        //         console.log("what happend");
        //       return done(null, false, { message: 'Incorrect username.' });
        //     }
        //     if (!user.validPassword(password)) {
        //         console.log("what happend");
        //       return done(null, false, { message: 'Incorrect password.' });
        //     }
        //     console.log("what");
        //     return done(null, user);
        //   });
        // })
    
));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
app.use("/student", studentRoutes);
app.use("/faculty", facultyRoutes);

// app.listen(process.env.PORT, process.env.IP, function(){
//    console.log("The Travel Blog Server Has Started!");
// });

const listener = app.listen(3000, function() {
   console.log('Your app is listening on port ' + listener.address().port);
})