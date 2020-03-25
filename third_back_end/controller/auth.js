let config = require('dotenv').config().parsed;
// const config = require('../config');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");


const User = require('../models/user');
const Student = require('../models/student');
const Faculty = require('../models/faculty');

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
            // if (user.entity === 'student') {
            //   model = new Student({
            //     user_id : user._id,
            //     email: req.body.email,
            //     date_of_joining: new Date().Format("yyyy-MM-dd hh:mm:ss")
            //   });
            // } else if (user.entity === 'faculty') {
            //   model = new Faculty({
            //     user_id : user._id,
            //     email: req.body.email,
            //     date_of_joining: new Date().Format("yyyy-MM-dd hh:mm:ss")
            //   });
            // }

            // console.log(model);

            // model
            //   .save()
            //   .then(result => {
            //     res.status(201).json({
            //       message: "User created!"
            //     });
            //   })
            //   .catch(err =>{
            //     res.status(500).json({
            //       message: "User profile create failed!"
            //     });
            //   })
            saveProfile(user).then((newlyCreated) => {
              res.status(201).json({
                message: "User created!"
              });
            }).catch(err => { console.log(err); res.status(500).json({error: "error"})})
          })
          .catch(err => {
            res.status(500).json({
              message: "Email address is used!"
            });
          });
        })
    )
}

saveProfile = (user) => {
  return new Promise((res, rej) => {
    if(user.entity == 'faculty') {

      let faculty = new Faculty({ 
        user_id : user._id,
        email: user.email,
        date_of_joining: new Date().toLocaleString()
      });

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
      
      let student = new Student({ 
            user_id : user._id,
            email: user.email,
            date_of_joining: new Date().toLocaleString()
      });

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
    User.findOne({ email: req.body.email, entity: req.body.entity })
      .then(user => {
        if (!user) {
          res.status(401).json({
            message: "Auth failed"
          });
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
      })
      .then(result => {
        if (!result) {
          res.status(401).json({
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
        res.status(401).json({
          message: "Invalid authentication credentials!"
        });
      });
  }