var mongoose = require("mongoose");


var FacultySchema = new mongoose.Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	first_name: String,
	middle_name: String,
	last_name: String,
	email: String,
	gender: String,
	date_of_joining: String,
	date_of_birth: String,
	address: String,
	phone: String,
	research_summary: String,
	current_projects: String,
	department: String,
	education: String,
	experience: String,
	image: String,
});


module.exports = mongoose.model("Faculty", FacultySchema);