var mongoose = require("mongoose");

// Models
const Student = require('../models/student');
const Faculty = require('../models/faculty');
const Application = require('../models/application');

exports.addToShoppingCart = async (req, res) => {
    try {
        let student = await Student.findOneAndUpdate({user_id: req.body.id}, 
            { $push: {shopping_cart: req.body.newItem}},{new: true});
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

exports.deleteItem = async (req, res) => {
    try {
        let student = await Student.findOneAndUpdate({user_id: req.body.id}, 
            { $pull: {shopping_cart: req.body.Itemid}},{new:true});
        res.status(200).json({
            message: 'Item delete successful!',
            student: student
        })
    } catch(e) {
        console.log(e);
        res.status(500).json({
            message: "Item delete failed!",
            student: null
        });
    }
}

exports.getShoppingCartItemsByIds = async (req, res) => {
    try {
        let ids = req.body.ids
        let obj_ids = ids.map(id => { return mongoose.Types.ObjectId(id); })
        let Faculties = await Faculty.find({_id: {$in: obj_ids}});
        res.status(200).json({
            message: 'Shopping cart items retrive successful',
            items: Faculties
        })
    } catch(e) {
        console.log(e);
        res.status(500).json({
            message: "Shopping cart items retrive failed!",
            items: null
        });
    }
}