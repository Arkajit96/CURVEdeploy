const express = require("express");
const router  = express.Router();

const uploadImage = require("../middleware").imgUpload;

// Controller
const researchControllor = require('../controller/research');

//middleware
const checkAuth = require("../middleware/check-auth");
// change to fileUpload
const fileUpload = require("../middleware").fileUpload;

// Opportunities create
router.post("/createOrUpdateOpportunity", checkAuth, researchControllor.createOrUpdateOpportunity);

// Upload opportunities Icon
router.post("/uploadIcon", checkAuth, uploadImage.single('image'), researchControllor.uploadOpportunityIcon);

// get research opportunies 
router.get("/getOpportunities/",researchControllor.getOpportunities);

// get opportunty by id 
router.get("/getOptByIds/:optId",researchControllor.getOptByIds);

// get opt and application by opt id and student id 
router.get("/getApplicationInfo/",researchControllor.getApplicationInfo);

// get candidates
router.get("/getCandidates/:id",researchControllor.getCandidates);

// create new application 
router.post("/createApplication",checkAuth, researchControllor.createApplication);

// create multiple applications 
router.post("/createMultiApplications",checkAuth, researchControllor.createMultiApplications);

// update the status of application
router.post("/updateApplicationStatus",checkAuth, researchControllor.updateApplicationStatus);

//upload file to the application
router.post("/uploadFile", checkAuth, fileUpload.single('file'), researchControllor.uploadFile);

//upload file to the multiple applications
router.post("/uploadFileMultiApp", checkAuth, fileUpload.single('file'), researchControllor.uploadFileMultiApp);

module.exports = router;