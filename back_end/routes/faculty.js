var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/User");
var Faculty = require("../models/faculty");
var middlewareObj = require("../middleware");
var mongoose = require("mongoose");
var Institution = require("../models/institution");
var FacultyProfile = require("../models/facultyProfile");

// when user login, according to the userid to get the information of this faculty
router.get("/:id", middlewareObj.isLoggedIn, function(req, res, next) {
    console.log("back end req" + req.params.id);
    var id = mongoose.Types.ObjectId(req.params.id);
    Faculty.findOne({"user_id": id}, function(err, faculty){
        if(err){
            console.log(err);
        } else {
        res.send(faculty);
        }
     });

})

// get the institution information of this faculty
router.get("/institution/:id", middlewareObj.isLoggedIn, function(req, res, next) {
    console.log("institution id:" + req.params.id);
    Institution.findById(req.params.id, function(err, foundInstitution) {
        res.send(foundInstitution);
    })
})

// create profile
router.post("/newFaculty", function(req, res){
    // get data from form and add to studentProfile
    var fisrt_name = req.body.first_name;
    var middle_name = req.body.middle_name;
    var last_name = req.body.last_name;
    var gender = req.body.gender;
    var email = req.body.email;
    var address = req.body.address;
    var date_of_joining = req.body.date_of_joining;
    var date_of_birth = req.body.date_of_birth;


    // new 2 lines!
    var newFaculty = {fisrt_name: fisrt_name, middle_name: middle_name, last_name: last_name, gender:gender, email:email, 
        address:address, date_of_birth:date_of_birth, date_of_joining:date_of_joining}
    // Create a new studentProfile and save to DB
    Faculty.create(newFaculty, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to blogs page
            console.log(newlyCreated);
            //res.redirect("/blogs");
        }
    });
});
module.exports = router;