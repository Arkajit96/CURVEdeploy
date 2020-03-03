var express = require("express");
var router  = express.Router();
var passport = require("passport");

// Model
var User = require("../models/User");
var Faculty = require("../models/faculty");

// Controllor
const FacultyControllor = require('../controller/faculty');

//middleware
const checkAuth = require("../middleware/check-auth");

// var middlewareObj = require("../middleware").middlewareObj;
const uploadImage = require("../middleware").imgUpload;
var mongoose = require("mongoose");
var Institution = require("../models/institution");
var FacultyProfile = require("../models/facultyProfile");
const Helper = require('../helpers/index');

// Opportunities create
router.post("/createOpportunies", FacultyControllor.createOpportunities);

// when user login, according to the userid to get the information of this faculty
router.get("/:id", checkAuth, function(req, res, next) {
    // console.log("back end req" + req.params.id);
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
router.get("/institution/:id", checkAuth, function(req, res, next) {
    console.log("institution id:" + req.params.id);
    Institution.findById(req.params.id, function(err, foundInstitution) {
        res.send(foundInstitution);
    })
})


// Search for faculty by name, major, interests
router.get("/search/:query", checkAuth, async (req,res) => {
    let query = req.params.query.split(' ');
    Helper.SearchHelper(query, req.params.query)
    .then((results) => {
        res.status(200).send({"names": results.names, "departments": results.departments, "interests": results.interests});
    })
    .catch((e) => {
        res.status(500).send("ERROR");
    })
})

router.post("/update", checkAuth, async function(req, res) {
    try {
      const updates = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        gender: req.body.gender,
        email: req.body.email,
        phone: req.body.phone,
        education: req.body.education,
        experience: req.body.experience,
        address: req.body.address,
        department: req.body.department
      }
      const faculty = await Faculty.findOneAndUpdate({user_id: req.body.user_id}, updates);
      faculty.first_name = req.body.first_name;
      faculty.last_name = req.body.last_name;
      faculty.gender = req.body.gender;
      faculty.email = req.body.email;
      faculty.phone = req.body.phone;
      faculty.education = req.body.education,
      faculty.experience = req.body.experience
      faculty.department = req.body.department,
      faculty.address = req.body.address
  
      res.send(faculty); 
    } catch(e) {
      res.status(400).send(e);
    }
  })

router.put("/editInterest", checkAuth, async function(req, res) {
    try {
      let faculty = await Faculty.findOneAndUpdate({user_id: req.body.id}, {interests: req.body.interests});
      faculty.interests = req.body.interests;
      res.send(faculty);
    } catch(e) {
      console.log(e);
      res.send(e);
    }
    // res.send('OK');
  })

  router.post("/update/summary", checkAuth, async function(req, res) {
      try {
        let faculty = await Faculty.findOneAndUpdate({user_id: req.body.id}, {
            research_summary: req.body.researchSummary,
            current_projects: req.body.currentProjects
        });
        faculty.current_projects = req.body.currentProjects;
        faculty.research_summary = req.body.researchSummary;
        res.send(faculty);
      } catch(e) {
          console.log(e);
          res.status(400).send(e);
      }
  })

  router.post("/upload/profilePic", checkAuth, uploadImage.single('image'), async function(req, res) {
    let id = mongoose.Types.ObjectId(req.body.id);

    try{
      let faculty = await Faculty.findOneAndUpdate({user_id: id}, {image: req.file.location});
      let oldImg = faculty.image;
      if(oldImg && oldImg.trim() != ''){
        Helper.deleteS3(oldImg);
      }
      faculty.image = req.file.location;
      res.send(faculty);
    } catch(e) {
      console.log(e);
      res.send(e);
    }
  })

module.exports = router;