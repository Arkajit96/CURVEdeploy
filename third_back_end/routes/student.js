var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/User");
var Faculty = require("../models/faculty");
var Student = require("../models/student");
var Blog = require("../models/blog");
var middlewareObj = require("../middleware").middlewareObj;
const uploadImage = require("../middleware").upload;
var mongoose = require("mongoose");
var Institution = require("../models/institution");
const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const Grid = require('gridfs-stream');
const Helper = require('../helpers/index');
const mongodb = require('mongodb');


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


const mongoAdd = 'mongodb+srv://yueningzhu505:volunteer123@cluster0-9ccmb.mongodb.net/curve';
const connect = mongoose.createConnection(mongoAdd);
let gfs;
connect.once('open',() => {
    gfs = Grid(connect.db, mongoose.mongo);
    gfs.collection('uploads');
})
const storage = new GridFsStorage({
    url: mongoAdd,
    file: (req, file) => {
      console.log(req.params.id)
      user_id = req.params.id
      return new Promise((resolve, reject) => {
        console.log(file.originalname);
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          gfs.files.find({"metadata.studentID": user_id}).toArray(function(err, files){
            gfs.files.deleteOne({"metadata.studentID": user_id});
        });
          const filename = buf.toString('hex') + path.extname(file.originalname);
          const studentID = user_id
          const fileInfo = {
            filename: filename,
            bucketName: req.params.filename,
            metadata: {
              studentID: user_id
            }
          };
          resolve(fileInfo, studentID);
        });
      });
    }
    });
  const upload = multer({ storage });
  router.post("/edit/resumes/:filename/:id", upload.single('file'),(req,res) => {
    //res.json({file: req.file});
    console.log(1111);
    res.json({'message':'upload successfully'});
});


router.get("/transcript/:filename/:id", (req, res) => {
    gfs = Grid(connect.db, mongoose.mongo);
    gfs.collection(req.params.filename); //set collection name to lookup into

    /** First check if file exists */
    console.log(req.params.id);
    gfs.files.find({"metadata.studentID": req.params.id}).toArray(function(err, files){
        if(!files || files.length === 0){
            return res.status(404).json({
                responseCode: 1,
                responseMessage: "error"
            });
        }
        // create read stream
        var readstream = gfs.createReadStream({
            filename: files[0].filename,
            root: req.params.filename
        });
        // set the proper content type 
        res.set('Content-Type', files[0].contentType)
        //const file = `${__dirname}`;
        //res.download(file);
        console.log("display")
        readstream.pipe(res);
        //res.attachment('5.pdf');
        //readstream1.pipe(res);
    });   
});



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

router.put("/editInterest", middlewareObj.isLoggedIn, async function(req, res) {
  console.log(req.body.id);
  try {
    let student = await Student.findOneAndUpdate({user_id: req.body.id}, {interests: req.body.interests});
    student.interests = req.body.interests;
    res.send(student);
  } catch(e) {
    console.log(e);
    res.send(e);
  }
  // res.send('OK');
})

router.get("/search/:query", middlewareObj.isLoggedIn, async function(req, res) {
  let query = req.params.query.split(' ');
  Helper.SearchHelper(query, req.params.query)
  .then((result) => {
    res.send(result);
  })
  .catch((e) => {
    res.status(400).send();
  })
});

router.post("/upload/profilePic", middlewareObj.isLoggedIn, uploadImage.single('image'), async function(req, res) {
    console.log(req.body.id);
    let id = mongoose.Types.ObjectId(req.body.id);
    console.log(id);
    try{
      let student = await Student.findOneAndUpdate({user_id: id}, {image: req.file.location});
      console.log(student);
      res.send(student);
    } catch(e) {
      console.log(e);
      res.send(e);
    }
})


module.exports = router;