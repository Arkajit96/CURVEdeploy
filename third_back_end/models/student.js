var mongoose = require("mongoose");
//var passportLocalMongoose = require("passport-local-mongoose");

var StudentSchema = new mongoose.Schema({
	user_id: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	},
	first_name: { type: String, default: ''},
	middle_name: { type: String, default: ''},
	last_name: { type: String, default: ''},
	gender: { type: String, default: ''},
	email: { type: String, default: ''},
	date_of_joining: { type: String, default: ''},
	date_of_birth: { type: String, default: ''},
    address: { type: String, default: ''},
    major: { type: String, default: ''},
	minor: { type: String, default: ''},
	phone: { type: String, default: ''},
	summary: { type: String, default: ''},
	department: { type: String, default: ''},
	education: { type: String, default: ''},
	image: { type: String, default: 'https://curve-public-bucket.s3.us-east-2.amazonaws.com/default_profile.png'},
	graduation_class: { type: Number, default: 0},
	interests: [String],
	resume: { type: String, default: ''},
	cv: { type: String, default: '' },
	shopping_cart: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Faculty"
		}
	]
});

module.exports = mongoose.model("Student", StudentSchema);