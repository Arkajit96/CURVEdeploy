var express = require("express");
var router = express.Router();
var passport = require("passport");

// Model
var User = require("../models/User");
var Faculty = require("../models/faculty");

//middleware
const checkAuth = require("../middleware/check-auth");

var mongoose = require("mongoose");
var Institution = require("../models/institution");
const Helper = require('../helpers/index');

// UPDATE MODEL of faculty
router.get("/update/model", async function (req, res) {
    try {
        await Faculty.updateMany({}, { $set: { opportunity: null } });
        res.status(200).send('Updated');
    } catch (e) {
        res.status(400).send(e);
    }
})


// when user login, according to the userid to get the information of this faculty
router.get("/:id", checkAuth, function (req, res, next) {
    // console.log("back end req" + req.params.id);
    var id = mongoose.Types.ObjectId(req.params.id);
    Faculty.findOne({ "user_id": id }, function (err, faculty) {
        if (err) {
            res.status(500).json({
                message: "Fetching Faculty failed!",
                faculty: null
            });
        } else {
            res.status(200).json({
                message: "Faculty fetched successfully",
                faculty: faculty
            })
        }
    });

})

// get the institution information of this faculty
router.get("/institution/:id", checkAuth, function (req, res, next) {
    console.log("institution id:" + req.params.id);
    Institution.findById(req.params.id, function (err, foundInstitution) {
        res.send(foundInstitution);
    })
})


// Search for faculty by name, major, interests
router.get("/search/:query", checkAuth, async (req, res) => {
    let query = req.params.query.split(' ');
    Helper.SearchHelper(query, req.params.query)
        .then((results) => {
            res.status(200).send({ "names": results.names, "departments": results.departments, "interests": results.interests });
        })
        .catch((e) => {
            res.status(500).send("ERROR");
        })
})

router.put("/edit/:id", checkAuth, function (req, res) {
    console.log(req.body);

    console.log(req.params.id);

    Faculty.findByIdAndUpdate(req.params.id, req.body, function (err, updatedFaculty) {
        if (err) {
            res.send({ 'message': 'something wrong' });
        } else {
            res.send({ 'message': 'successful', 'id': updatedFaculty.user_id });
        }
    });
})


module.exports = router;