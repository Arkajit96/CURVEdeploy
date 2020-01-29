let config = require('dotenv').config().parsed;
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

var User = require('../models/User');
const Faculty = require('../models/faculty');
const Student = require('../models/student');

exports.register = (req, res) => {
  // hash password
  bcrypt.genSalt(10,(err,salt) => 
    bcrypt.hash(req.body.password,salt,(err,hash) => {
        if(err) throw err;
        const user = new User({
          email: req.body.email,
          password: hash,
          entity: req.body.entity
        });
        console.log(user);

        // save user data
        user
          .save()
          .then(result => {
            // implement this function when models are defined
            saveProfile(req.body, result.id).then((newlyCreated) => {
              console.log(newlyCreated);
              res.status(201).json({
                message: "User created!"
              });
            }).catch(err => { console.log(err); res.status(500).json({error: "error"})})
          })
          .catch(err => {
            res.status(500).json({
              message: "Invalid authentication credentials!"
            });
          });
        })
    )
}

saveProfile = (user, id) => {
  return new Promise((res, rej) => {
    if(user.entity == 'faculty') {
      let faculty = new Faculty({first_name:'', middle_name:'', last_name:'', email:user.email, gender: '', date_of_birth:'', date_of_joining:'',
                              address:'', phone: '', research_summary:'', current_projects:'', department:'', education:'',
                              experience:'', image:'',user_id:id, interests:[] });
      Faculty.create(faculty, function(err, newlyCreated) {
        if (err) {
          console.log(err);
          rej(error);
        } else {
          console.log(newlyCreated);
          res(newlyCreated);
        }
      });
    } else {
      let student = new Student({first_name:'', middle_name:'', last_name:'', email:user.email, gender: '', date_of_birth:'', date_of_joining:'',
                            address:'', phone: '', summary:'', department:'', education:'', major:'', minor:'',
                            experience:'', image:'',user_id:id, graduation_class:null, interests: []});
      Student.create(student, function(err, newlyCreated) {
        if (err) {
          console.log(err);
          rej(error);
        } else {
          console.log(newlyCreated);
          res(newlyCreated);
        }
      });
    }
  })
}

exports.userLogin = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
      .then(user => {
        console.log(user);
        if (!user) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
      })
      .then(result => {
        if (!result) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        const token = jwt.sign(
          { email: fetchedUser.email, userId: fetchedUser._id },
          config.SECRETKEY,
          { expiresIn: "1h" }
        );
        res.status(200).json({
          token: token,
          expiresIn: 3600,
          userId: fetchedUser._id,
          entity: fetchedUser.entity
        });
      })
      .catch(err => {
        return res.status(401).json({
          message: "Invalid authentication credentials!"
        });
      });
  }