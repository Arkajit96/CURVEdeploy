let config = require('dotenv').config().parsed;
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const User = require('../models/User');
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

        let model;

        // save user data
        user
          .save()
          .then(result => {
            // implement this function when models are defined
            if (user.entity === 'student') {
              model = new Student({
                // user_id : user._id,
                email: req.body.email,
                date_of_joining: new Date().Format("yyyy-MM-dd hh:mm:ss")
              });
            } else if (user.entity === 'faculty') {
              model = new Faculty({
                // user_id : user._id,
                email: req.body.email,
                date_of_joining: new Date().Format("yyyy-MM-dd hh:mm:ss")
              });
            }

            console.log(model);

            model
              .save()
              .then(result => {
                res.status(201).json({
                  message: "User created!"
                });
              })
              .catch(err =>{
                res.status(500).json({
                  message: "User profile create failed!"
                });
              })

          })
          .catch(err => {
            res.status(500).json({
              message: "Email address is used!"
            });
          });
        })
    )
}


exports.userLogin = (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
      .then(user => {
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