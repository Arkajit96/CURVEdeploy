var mongoose = require("mongoose");


var FacultySchema = new mongoose.Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	first_name: { type: String, default: ''},
	middle_name: { type: String, default: ''},
	last_name: { type: String, default: ''},
	email: { type: String, default: ''},
	gender: { type: String, default: ''},
	date_of_joining: { type: String, default: ''},
	date_of_birth: { type: String, default: ''},
	school: { type: String, default: ''},
	address: { type: String, default: ''},
	phone: { type: String, default: ''},
	research_summary: { type: String, default: ''},
	current_projects: { type: String, default: ''},
	department: { type: String, default: ''},
	education: { type: String, default: ''},
	experience: { type: String, default: ''},
	image: { type: String, default: 'https://curve-public-bucket.s3.us-east-2.amazonaws.com/default_profile.png'},
	interests: [String],
	available: { type: Boolean, default: true},
	opportunity:{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Opportunity"
	},
	candidates: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Student"
		}
	] 
});


module.exports = mongoose.model("Faculty", FacultySchema);