var mongoose = require("mongoose");


var oppurtunitySchema = new mongoose.Schema({
    name:{ type: String, default: ''},
    icon:{ type: String, default: ''},
    school:{ type: String, default: ''},
    department:{ type: String, default: ''},
    expireTime: { type: String, default: ''},
    summary:{ type: String, default: ''},
    creator:{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Faculty"
		},
});


module.exports = mongoose.model("oppurtunity", oppurtunitySchema);