var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/User");
var Faculty = require("../models/faculty");
var Student = require("../models/student");
var Blog = require("../models/blog");


//handle sign up logic
router.post("/register", function(req, res){
    console.log(req.body)
    
    let user = req.body;
    
    var newUser = new User({username: user.username, entity: user.entity});
    console.log(user.username);
    User.register(newUser, user.password, function(err, user){
        if(err){
            console.log(err.message);
            req.flash("error", err.message);
            return res.render("register");
        }
        res.send(user);
        passport.authenticate("local")(req, res, function(){
            console.log("succeefully");
            console.log(user.username);
            // req.flash("success", "Welcome to Travel Blog " + user.username);
            // res.redirect("/blogs"); 
        });
    });
});


router.post("/facultyLogin", function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { 
        console.log("why"); }
        //return res.redirect('/'); }
  
      // req / res held in closure
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return user;
      });
      res.send(user);
      //res.redirect('/profile/');
  
    })(req, res, next);
  
  });

// logout route
// router.get("/logout", function(req, res){
//    req.logout();
//    req.flash("success", "Logged you out!");
//    res.redirect("/blogs");
// });



module.exports = router;