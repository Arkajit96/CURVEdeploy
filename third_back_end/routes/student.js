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

module.exports = router;