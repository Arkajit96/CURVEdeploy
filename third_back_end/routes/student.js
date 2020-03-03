const express = require("express");
const router  = express.Router();
const passport = require("passport");

// Model
const User = require("../models/User");
const Faculty = require("../models/faculty");
const Student = require("../models/student");

// Middleware
const checkAuth = require("../middleware/check-auth");
// var middlewareObj = require("../middleware");

// Controllor
const studentControllor = require('../controller/student');


const uploadImage = require("../middleware").imgUpload;
const uploadFile = require("../middleware").fileUpload;

var mongoose = require("mongoose");
var Institution = require("../models/institution");
const GridFsStorage = require('multer-gridfs-storage');
const multer = require('multer');
const crypto = require('crypto');
const path = require('path');
const Grid = require('gridfs-stream');
const Helper = require('../helpers/index');

const addEsIndex = Helper.esSearch;
const mongodb = require('mongodb');


// when user login, according to the userid to get the information of this student
router.get("/:id", checkAuth, function(req, res, next) {
    // console.log("backend fatched user: " + req.userData.userId)
    Student.findOne({"user_id": req.params.id}, function(err, student){
        if(err){
          res.status(500).json({
            message: "Fetching student failed!",
            student: null
          });
        } else {
          res.status(200).json({
            message: "student fetched successfully",
            student:student
          })
        }
     });
})

// get the institution information of this student
router.get("/institution/:id", checkAuth, function(req, res, next) {
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



// router.put("/edit/:id", checkAuth, function(req, res) {
//     console.log(typeof req.body);
//     console.log(req.body);
//     console.log(req.params.id);
    
//     Student.findByIdAndUpdate(req.params.id, req.body, function(err, updatedStudent) {
//         if (err) {
//             console.log('error');
//             res.send({'message':'something wrong'});
//         } else {
//             res.send({'message':'successful', 'id': updatedStudent.user_id});
//         }
//     });
// })

router.post("/update", checkAuth, async function(req, res) {
  try {
    const updates = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      gender: req.body.gender,
      date_of_birth: req.body.date_of_birth,
      major: req.body.major,
      minor: req.body.minor,
      email: req.body.email,
      phone: req.body.phone
    }
    const student = await Student.findOneAndUpdate({user_id: req.body.user_id}, updates);
    
    student.first_name = req.body.first_name;
    student.last_name = req.body.last_name;
    student.gender = req.body.gender;
    student.date_of_birth = req.body.date_of_birth;
    student.major = req.body.major;
    student.minor = req.body.minor;
    student.email = req.body.email;
    student.phone = req.body.phone;

    res.send(student); 
  } catch(e) {
    res.status(400).send(e);
  }
})


router.put("/editInterest", checkAuth, async function(req, res) {
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

// Basic includes search
router.get("/search/:query", checkAuth, async function(req, res) {
  let query = req.params.query.split(' ');
  Helper.SearchHelper(query, req.params.query)
  .then((result) => {
    res.send(result);
  })
  .catch((e) => {
    res.status(400).send();
  })
});

// Uploads a picture to be saved as image field
// Uploads to aws s3
// Should take image and id as form-data
router.post("/upload/profilePic", checkAuth, uploadImage.single('image'), async function(req, res) {
    let id = mongoose.Types.ObjectId(req.body.id);

    try{
      let student = await Student.findOneAndUpdate({user_id: id}, {image: req.file.location});
      let oldImg = student.image;
      if(oldImg && oldImg.trim() != ''){
        Helper.deleteS3(oldImg);
      }
      student.image = req.file.location;
      res.send(student);
    } catch(e) {
      console.log(e);
      res.send(e);
    }
})

router.post("/upload/file", checkAuth, uploadFile.single('file'), async function(req, res) {
  let id = mongoose.Types.ObjectId(req.body.id);

  try {
    let fileType = req.body.fileType; // Either cv or resume
    student = {};
    if (fileType == 'cv') {
      student = await Student.findOneAndUpdate({user_id: id}, {cv: req.file.location});
    } else if (fileType == 'resume') {
      student = await Student.findOneAndUpdate({user_id: id}, {resume: req.file.location});
    } else {
      res.status(400).send({message: "Upload only supports cv and resume params"});
    }
    
    let oldFile = student[fileType];
    if(oldFile && oldFile.trim() != ''){
      Helper.deleteS3(oldFile);
    }
    student[fileType] = req.file.location;
    res.send(student);
  } catch(e) {
    console.log(e);
    res.status(400).send({errors: e});
  }
});


// Update a students summary field
router.post("/update/summary", checkAuth, async function(req, res) {
  let id = req.body.user_id
  let summary = req.body.summary

  try {
    let student = await Student.findOneAndUpdate({user_id: id}, {summary: summary});
    if(!student) {
      res.status(404).send({'error': "Could not find student"});
    }
    student.summary = summary;
    res.status(200).send(student);
  } catch(e) {
    res.status(500).send({'error': "Error updating summary"});
  }
})


// UPDATE DOCUMENTS TO MATCH MODEL
router.post("/update/model", checkAuth, async function(req, res) {
  try {
    await Student.updateMany({}, {$set: {cv: ''}});
    res.status(200).send('Updated');
  } catch(e) {
    res.status(400).send(e);
  }
})

router.post("/add/index", checkAuth, async function(req, res) {
  try {
    const students = await Student.find({});
    console.log(students.length);
    let promiseArr = [];
    students.forEach((s) => {
      promiseArr.push(addEsIndex(s));
    });
    Promise.all(promiseArr)
    .then((body) => {
      res.send('ok');
    })
    .catch((e) => {
      console.log(e);
      res.status(400).send('Error');
    })
    // res.send('ok');
  } catch(e) {
    res.status(400).send("Error");
  }
})

// add application to the shopping cart
router.post("/addToShoppingCart",checkAuth,studentControllor.addToShoppingCart);

// delete item from the cart
router.post("/deleteItem",checkAuth,studentControllor.deleteItem);

// get shopping cart
router.post("/getShoppingCartItemsByIds",checkAuth,studentControllor.getShoppingCartItemsByIds);

module.exports = router;