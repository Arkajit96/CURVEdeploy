var express = require("express");
var router  = express.Router();
// const bcrypt = require('bcryptjs')
// var passport = require("passport");


var User = require("../models/user");
const checkAuth = require("../middleware/check-auth");
var UserController = require("../controller/auth");




//handle sign up logic
router.post("/register", UserController.register) 
// function(req, res){

  // hash password
  // bcrypt.genSalt(10,(err,salt) => 
  //   bcrypt.hash(req.body.password,salt,(err,hash) => {
  //       if(err) throw err;
  //       const user = new User({
  //         email: req.body.email,
  //         password: hash,
  //         entity: req.body.entity
  //       });
  //       console.log(user);

  //       res.status(201).json({
  //         message: "User created!"
  //       });

  //       // save user data
  //       user
  //         .save()
  //         .then(result => {
  //           res.status(201).json({
  //             message: "User created!"
  //           });
  //         })
  //         .catch(err => {
  //           res.status(500).json({
  //             message: "Invalid authentication credentials!"
  //           });
  //         });


  //         //creat corresponding profile
  //   if (user.entity == "faculty") {
  //         faculty = new Faculty({first_name:'', middle_name:'', last_name:'', email:user.username, gender: '', date_of_birth:'', date_of_joining:'',
  //                               address:'', phone: '', research_summary:'', current_projects:'', department:'', education:'',
  //                               experience:'', image:'',user_id:user._id, interests:[] });
  //         Faculty.create(faculty, function(err, newlyCreated) {
  //           if (err) {
  //             console.log(err);
  //           } else {
  //             console.log(newlyCreated);
  //           }
  //         });
  //       } 
  //       if (user.entity == "student") {
  //         student = new Student({first_name:'', middle_name:'', last_name:'', email:user.username, gender: '', date_of_birth:'', date_of_joining:'',
  //                               address:'', phone: '', summary:'', department:'', education:'', major:'', minor:'',
  //                               experience:'', image:'',user_id:user._id, graduation_class:null, interests: []});
  //         Student.create(student, function(err, newlyCreated) {
  //           if (err) {
  //             console.log(err);
  //           } else {
  //             console.log(newlyCreated);
  //           }
  //         });
  //       }
  // }))
    
    // var newUser = new User({username: user.username, entity: user.entity});
    

    // console.log(user.username);
    // User.register(newUser, user.password, function(err, user){
    //     if(err){
    //         console.log(err.message);
    //         req.flash("error", err.message);
    //         return res.render("register");
    //     }
    //     if (user.entity == "faculty") {
    //       faculty = new Faculty({first_name:'', middle_name:'', last_name:'', email:user.username, gender: '', date_of_birth:'', date_of_joining:'',
    //                             address:'', phone: '', research_summary:'', current_projects:'', department:'', education:'',
    //                             experience:'', image:'',user_id:user._id, interests:[] });
    //       Faculty.create(faculty, function(err, newlyCreated) {
    //         if (err) {
    //           console.log(err);
    //         } else {
    //           console.log(newlyCreated);
    //         }
    //       });
    //     } 
    //     if (user.entity == "student") {
    //       student = new Student({first_name:'', middle_name:'', last_name:'', email:user.username, gender: '', date_of_birth:'', date_of_joining:'',
    //                             address:'', phone: '', summary:'', department:'', education:'', major:'', minor:'',
    //                             experience:'', image:'',user_id:user._id, graduation_class:null, interests: []});
    //       Student.create(student, function(err, newlyCreated) {
    //         if (err) {
    //           console.log(err);
    //         } else {
    //           console.log(newlyCreated);
    //         }
    //       });
    //     }
    //     res.send(user);
    //     passport.authenticate("local")(req, res, function(){
    //         console.log("succeefully");
    //         console.log(user.username);
    //         // req.flash("success", "Welcome to Travel Blog " + user.username);
    //         // res.redirect("/blogs"); 
    //     });
    // });
// });


router.post("/login", UserController.userLogin)
// function(req, res, next) {
  // res.send({'body': req.body})
    // passport.authenticate('local', function(err, user, info) {
    //   if (err) { return next(err); }
    //   if (!user) { 
    //     console.log("user does not exist");
    //     return res.send({'message':"user does not exist, please register first !"})
    //   }
    //     //return res.redirect('/'); }
  
    //   // req / res held in closure
    //   req.logIn(user, function(err) {
    //     if (err) { return next(err); }
    //     return user;
    //   });
    //   res.send({'body': user});
    //   //res.redirect('/profile/');
  
    // })(req, res, next);
  
  // });

// logout route
// router.get("/logout", function(req, res){
//   console.log("1111")
//   req.logout();
//   res.send({'message':'log out successfully'});
// });


module.exports = router;