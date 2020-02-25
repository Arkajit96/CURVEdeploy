var mongoose = require("mongoose");

// Models
const Student = require('../models/student');
const Application = require('../models/application');

exports.addToShoppingCart = async (req, res) => {
    try {
        let student = await Student.findOneAndUpdate({user_id: req.body.id}, {shopping_cart: req.body.shopping_cart});
        student.shopping_cart = req.body.shopping_cart;
        res.status(200).json({
            message: 'Shopping cart update successful',
            student: student
        })
    } catch(e) {
        console.log(e);
        res.status(500).json({
            message: "Shopping cart update failed!",
            student: null
        });
    }
}

exports.getShoppingCartItemsByIds = async (req, res) => {
    try {
        let ids = req.body.ids
        let obj_ids = ids.map(id => { return mongoose.Types.ObjectId(id); })
        let items = await Application.find({_id: {$in: obj_ids}});
        res.status(200).json({
            message: 'Shopping cart items retrive successful',
            items: items
        })
    } catch(e) {
        console.log(e);
        res.status(500).json({
            message: "Shopping cart items retrive failed!",
            items: null
        });
    }
}