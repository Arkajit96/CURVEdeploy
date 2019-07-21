var mongoose = require("mongoose");

var BlogSchema = new mongoose.Schema({
   name: String,
   check: Boolean,
   image: String,
   description: String,
   time: String,
   author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String,
        image: String
   },
   comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
   ]
});
   
module.exports = mongoose.model("Blog", BlogSchema);