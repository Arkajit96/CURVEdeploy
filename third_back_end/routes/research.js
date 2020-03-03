const express = require("express");
const router  = express.Router();

// Controller
const researchControllor = require('../controller/research');

//middleware
const checkAuth = require("../middleware/check-auth");
// change to fileUpload
const fileUpload = require("../middleware").fileUpload;

// Opportunities create
router.post("/createOpportunity", researchControllor.createOpportunity);

// get research opportunies 
router.get("/getOpportunities/",researchControllor.getOpportunities);

// get opportunty by id 
router.get("/getOptByIds/",researchControllor.getOptByIds);

// get candidates
router.get("/getCandidates/:id",researchControllor.getCandidates);

// create new application 
router.post("/createApplication",checkAuth, researchControllor.createApplication);

// create multiple applications 
router.post("/createMultiApplications",checkAuth, researchControllor.createMultiApplications);

//upload file to the application
router.post("/uploadFile", checkAuth, fileUpload.single('file'), researchControllor.uploadFile);

//upload file to the multiple applications
router.post("/uploadFileMultiApp", checkAuth, fileUpload.single('file'), researchControllor.uploadFileMultiApp);

module.exports = router;