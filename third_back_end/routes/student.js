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
var Grid = require('gridfs-stream');
var fs = require('fs');
const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');

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

router.post("/edit/resumes/:id", middlewareObj.isLoggedIn, function(req, res) {
    var conn = mongoose.connection;
    //connect GridFs and Mongo
    Grid.mongo = mongoose.mongo;
    const mongoAdd = 'mongodb+srv://yueningzhu505:volunteer123@cluster0-9ccmb.mongodb.net/curve';
    conn.once('open', function() {
        console.log('-Connection open--');
        var gfs = Grid(conn.db);
        gfs.collection('uploads');
    })
    student_id = req.params.id
    console.log(req.params.id)
    console.log(req)
    const storage = new GridFsStorage({
        url: mongoAdd,
        file: (req, file) => {
            console.log(req.body);  
            return new Promise((resolve, reject) => {
                crypto.randomBytes(16, (err, buf) => {
                    if (err) {
                        return reject(err);
                    }
                gfs.files.find({"metadata.studentID": student_id}).toArray(function(err, files){
                gfs.files.deleteOne({"metadata.studentID": student_id});
            });
              const filename = buf.toString('hex') + path.extname(file.originalname);
              const studentID = student_id
              const fileInfo = {
                filename: filename,
                bucketName: 'uploads',
                metadata: {
                  studentID: studentID
                }
              };
              resolve(fileInfo, studentID);
            });
          });
        }
      });
    const upload = multer({ storage });
      
    upload.single('file'),(req,res) => {
        console.log(req.body);
        res.json({file: req.body});
        //console.log("upload success!")
    };
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