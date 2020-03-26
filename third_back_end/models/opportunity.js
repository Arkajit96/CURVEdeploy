var mongoose = require("mongoose");


var oppurtunitySchema = new mongoose.Schema({
    name:{ type: String, default: ''},
    icon:{ type: String, default: 'https://curve-public-bucket.s3.us-east-2.amazonaws.com/default_profile.png'},
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