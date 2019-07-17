var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var FacultySchema = new mongoose.Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "UserInfo"
	},
	first_name: String,
	middle_name: String,
	last_name: String,
	gender: String,
	email: String,
	date_of_joining: Date,
	date_of_birth: Date,
	address: String,
	profile_id: 
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Faculty_profile"
		}
	,
	institution_id: 
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Institution"
		}
	

});

FacultySchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Faculty", FacultySchema);