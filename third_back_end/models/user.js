var mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
// var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: { type: String, required: true },
    entity: { type: String, required: true },
      
});

// UserSchema.plugin(passportLocalMongoose);
UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User_test", UserSchema);