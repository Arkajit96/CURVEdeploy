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
<<<<<<< HEAD
    User       = require("./models/User"),
    seedDB      = require("./seeds");
   //  port        = 9292;
    
//requiring routes
var indexRoutes      = require("./routes/index"),
   studentRoutes = require("./routes/student"),
   facultyRoutes = require("./routes/faculty")
 
// var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v10";
// var uri = 'mongodb://JamesLin:<Lin!960605>@cluster0-x6qm9.mongodb.net/travelBlog?retryWrites=true'
// mongoose.connect(uri);
console.log(process.env.USERNAME)
=======
    User        = require("./models/user"),
    //GithubStrategy = require('passport-github').Strategy,
    dotenvConfig = require('dotenv').config();

//requiring routes
var commentRoutes    = require("./routes/comments"),
    blogRoutes = require("./routes/blogs"),
    indexRoutes      = require("./routes/index"),
    userRoutes      = require("./routes/user")

// connect mongo
>>>>>>> 782cf0c457c20d5814beb0cd145ad6e9b519a845
const mongoDB = ("mongodb+srv://"+
                 process.env.USERNAME+
                 ":"
                 +process.env.PASSWORD+
                 "@"
                 +process.env.HOST+
                 "/"
                 +process.env.DATABASE);
<<<<<<< HEAD
=======

>>>>>>> 782cf0c457c20d5814beb0cd145ad6e9b519a845
mongoose.connect(mongoDB, {useNewUrlParser: true, retryWrites: true});

// middleware used
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// github
// passport.use(new GithubStrategy({
//     clientID: process.env.GITHUB_CLIENT_ID,
//     clientSecret: process.env.GITHUB_CLIENT_SECRET,
//     callbackURL: 'https://'+process.env.PROJECT_DOMAIN+'.glitch.me/login/github/return',
// },
// function(token, tokenSecret, profile, cb) {
//     return cb(null, profile);
// }));
// passport.serializeUser(function(user, done) {
//     done(null, user);
// });
// passport.deserializeUser(function(obj, done) {
//     done(null, obj);
// });


// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "secret",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
<<<<<<< HEAD

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

=======
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
>>>>>>> 782cf0c457c20d5814beb0cd145ad6e9b519a845

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.error = req.flash("error");
   res.locals.success = req.flash("success");
   next();
});

app.use("/", indexRoutes);
<<<<<<< HEAD
app.use("/student", studentRoutes);
app.use("/faculty", facultyRoutes);

// app.listen(process.env.PORT, process.env.IP, function(){
//    console.log("The Travel Blog Server Has Started!");
// });

const listener = app.listen(3000, function() {
=======
app.use("/user", userRoutes);
app.use("/blogs", blogRoutes);
app.use("/blogs/:id/comments", commentRoutes);

const listener = app.listen(process.env.PORT, function() {
>>>>>>> 782cf0c457c20d5814beb0cd145ad6e9b519a845
   console.log('Your app is listening on port ' + listener.address().port);
})