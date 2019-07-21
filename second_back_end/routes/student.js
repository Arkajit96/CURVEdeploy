var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/User");
var Faculty = require("../models/faculty");
var Student = require("../models/student");
var Blog = require("../models/blog");
var middlewareObj = require("../middleware");
var mongoose = require("mongoose");
var Institution = require("../models/institution");
var StudentProfile = require("../models/studentProfile");

// when user login, according to the userid to get the information of this student
router.get("/:id", middlewareObj.isLoggedIn, function(req, res, next) {
    console.log("back end req" + req.params.id);
    var id = mongoose.Types.ObjectId(req.params.id);
    Student.findOne({"user_id": id}, function(err, student){
        if(err){
            console.log(err);
        } else {
        res.send(student);
        }
     });

})

// get the institution information of this student
router.get("/institution/:id", middlewareObj.isLoggedIn, function(req, res, next) {
    console.log("institution id:" + req.params.id);
    Institution.findById(req.params.id, function(err, foundInstitution) {
        res.send(foundInstitution);
    })
})

// update profile
// router.put("/:id",middleware.checkBlogOwnership, function(req, res){
//     // find and update the correct blog
//     Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
//        if(err){
//            res.redirect("/blogs");
//        } else {
//            //redirect somewhere(show page)
//            res.redirect("/blogs/" + req.params.id);
//        }
//     });
// });

router.put("/edit/:id", middlewareObj.isLoggedIn, function(req, res) {
    console.log(typeof req.body);
    console.log(req.body);
    console.log(req.params.id);
    Student.findByIdAndUpdate(req.params.id, req.body, function(err, updatedStudent) {
        if (err) {
            console.log('error');
            res.send({'message':'something wrong'});
        } else {
            res.send({'message':'successful', 'id': updatedStudent.user_id});
        }
    });
})
// create profile
// router.post("/edit", function(req, res){
//     // get data from form and add to studentProfile
//     var fisrt_name = req.body.first_name;
//     var middle_name = req.body.middle_name;
//     var last_name = req.body.last_name;
//     var gender = req.body.gender;
//     var email = req.body.email;
//     var address = req.body.address;
//     var major = req.body.major;
//     var minor = req.body.minor;
//     var phone = req.body.phone;

//     // new 2 lines!
//     var newStudentProfile = {fisrt_name: fisrt_name, middle_name: middle_name, last_name: last_name, gender:gender, email:email, 
//         address:address, major:major, minor:minor, phone:phone}
//     // Create a new studentProfile and save to DB
//     StudentProfile.create(newStudentProfile, function(err, newlyCreated){
//         if(err){
//             console.log(err);
//         } else {
//             //redirect back to blogs page
//             console.log(newlyCreated);
//             //res.redirect("/blogs");
//         }
//     });
//     router.put("/:id",middleware.checkBlogOwnership, function(req, res){
//     // find and update the correct blog
//     Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
//        if(err){
//            res.redirect("/blogs");
//        } else {
//            //redirect somewhere(show page)
//            res.redirect("/blogs/" + req.params.id);
//        }
//     });
// });
// });
module.exports = router;