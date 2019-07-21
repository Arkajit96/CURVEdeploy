var mongoose = require("mongoose");
//var passportLocalMongoose = require("passport-local-mongoose");

var StudentSchema = new mongoose.Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	first_name: String,
	middle_name: String,
	last_name: String,
	gender: String,
	email: String,
	date_of_joining: Date,
	date_of_birth: Date,
    address: String,
    major: String,
    minor: String,
	profile_id: 
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "FacultyProfile"
		},
	institution_id: 
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Institution"
		}

});

//StudentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Student", StudentSchema);