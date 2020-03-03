var mongoose = require("mongoose");


// Models
const Faculty = require('../models/faculty');

exports.changeAvalibility = (req, res) => {

    Faculty.findOneAndUpdate({ user_id: req.body.id }, 
        { available: req.body.available },(err, faculty) => {
            if (err) {
                console.log(err);
                res.status(500).json({
                    message: "Avalibility change failed!",
                    available: faculty.available
                });
            } else {
                res.status(200).json({
                    message: 'Avalibility change successful',
                    available: req.body.available
                })
            }
        })
}

