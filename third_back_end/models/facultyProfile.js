var mongoose = require("mongoose");
//var passportLocalMongoose = require("passport-local-mongoose");

var FacultyProfileSchema = new mongoose.Schema({
	faculty_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Student"
	},
	
	date_created: Date,
	date_last_updated: Date,
    summary: String,

});

//StudentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("FacultyProfile", FacultyProfileSchema);