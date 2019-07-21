var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
<<<<<<< HEAD
    entity: String,
      
=======
    identity: String,
    image: String
>>>>>>> 782cf0c457c20d5814beb0cd145ad6e9b519a845
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);