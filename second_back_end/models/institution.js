var mongoose = require("mongoose");




var InstitutionSchema = new mongoose.Schema({
    name: String,
	address: String,
	city: String,
	state: String,
	country: String,
	
});


module.exports = mongoose.model("Institution", InstitutionSchema);