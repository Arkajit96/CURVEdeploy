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
	date_of_joining: String,
	date_of_birth: String,
    address: String,
    major: String,
	minor: String,
	phone: String,
	summary: String,
	department: String,
	education: String,
	image: String,
	graduation_class: Number,
	interests: [String]

});

//StudentSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("Student", StudentSchema);