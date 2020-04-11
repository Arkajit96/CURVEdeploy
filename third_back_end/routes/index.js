var express = require("express");
var router  = express.Router();

// Controllor
var UserController = require("../controller/auth");

//handle sign up logic
router.post("/register", UserController.register) 

router.post("/login", UserController.userLogin)


module.exports = router;