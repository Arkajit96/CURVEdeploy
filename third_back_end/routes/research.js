const express = require("express");
const router  = express.Router();

// Controller
const researchControllor = require('../controller/research');

//middleware
const checkAuth = require("../middleware/check-auth");
// change to fileUpload
const fileUpload = require("../middleware").fileUpload;

// Opportunities create
router.post("/createOpportuny", researchControllor.createOpportunity);

// get research opportunies 
router.get("/getOpportunities/",researchControllor.getOpportunities);

// get opportunty by id 
router.get("/getOptById/:optId",researchControllor.getOptById);

// create new applications 
router.post("/createApplication",checkAuth, researchControllor.createApplication);

//upload file to the application
router.post("/uploadFile", checkAuth, fileUpload.single('file'), researchControllor.uploadFile);

module.exports = router;