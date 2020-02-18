const express = require("express");
const router  = express.Router();

// Controller
const researchControllor = require('../controller/research');

//middleware
const checkAuth = require("../middleware/check-auth");
// change to fileUpload
const uploadFile = require("../middleware").resumeUpload;


// Opportunities create
router.post("/createOpportuny", researchControllor.createOpportunity);


// get research opportunies 
router.get("/getOpportunities/",researchControllor.getOpportunities)

// create new applications 
router.post("/createApplication",researchControllor.createApplication)

//upload resume to the application
router.post("/uploadResume", checkAuth, uploadFile.single('file'), researchControllor.uploadResume);

//upload CV to the application
router.post("/uploadCV", checkAuth, uploadFile.single('file'), researchControllor.uploadCV);

module.exports = router;