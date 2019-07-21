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
        if (user.entity == "faculty") {
          faculty = new Faculty({first_name:'', middle_name:'', last_name:'', email:user.username, gender: '', date_of_birth:'', date_of_joining:'',
                                address:'', phone: '', research_summary:'', current_projects:'', department:'', education:'',
                                experience:'', image:'',user_id:user._id });
          Faculty.create(faculty, function(err, newlyCreated) {
            if (err) {
              console.log(err);
            } else {
              console.log(newlyCreated);
            }
          });
        } 
        if (user.entity == "student") {
          student = new Student({first_name:'', middle_name:'', last_name:'', email:user.username, gender: '', date_of_birth:'', date_of_joining:'',
                                address:'', phone: '', summary:'', department:'', education:'', major:'', minor:'',
                                experience:'', image:'',user_id:user._id, graduation_class:null});
          Student.create(student, function(err, newlyCreated) {
            if (err) {
              console.log(err);
            } else {
              console.log(newlyCreated);
            }
          });
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


router.post("/login", function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err); }
      if (!user) { 
        console.log("user does not exist");
        return res.send({'message':"user does not exist, please register first !"})
      }
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