var mongoose = require("mongoose");

// Models
const Opportunity = require('../models/opportunity');
const Application = require('../models/application');

const Helper = require('../helpers/index');

// Create new opportunities
exports.createOpportunity = (req, res) => {
    const opportunity = new Opportunity({
        name: req.body.name,
        icon: req.body.icon,
        school: req.body.school,
        department: req.body.department,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        expireTime: req.body.expireTime,
        summary: req.body.summary,
        // modifiy/add middleware for id
        creator: req.body.id
    });
    Opportunity.create(opportunity,function(err, newOpt) {
        if (err) {
            console.log(err);
            rej(error);
          } else {
            console.log(newOpt);
          }
    });
}

// Get all the opportunities
exports.getOpportunities = (req, res) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const query = Opportunity.find();
    let fetchedOpps;
    if (pageSize && currentPage) {
        query.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    query.then(
        documents => {
            fetchedOpps = documents;
            return Opportunity.count();
        }
    ).then(count => {
        res.status(200).json({
            message: "Opportunities fetched sucessfully!",
            opportunities: fetchedOpps,
            maxOpp:count
        });
    }).catch(error => {
        res.status(500).json({
            message: "Fetching Opportunities failed!"
        });
    });
}

// Get opportunity by id
exports.getOptById= (req, res) => {
    Opportunity.findOne({"_id": req.params.optId}, function(err, opt){
        if(err){
          res.status(500).json({
            message: "Fetching opportunity failed!"
          });
        } else {
          res.status(200).json({
            message: "Opportunity fetched successfully",
            opt:opt
          })
        }
    });
}

// create new application
exports.createApplication  = (req, res) => {
    const application = new Application({
        studentID: req.body.studentID,
        opportunityID: req.body.opportunityID,
        resume: req.body.resume,
        coverLetter: req.body.coverLetter,
        createTime: new Date().toLocaleString()
    })

    console.log(application);
    Application.create(application,function(err, newApplication) {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "Application create failed!",
                applicationID:''
            });
          } else {
            res.status(200).json({
                message: 'Application create successful',
                applicationID: newApplication._id
            })
          }
    })
}

// upload file to application
exports.uploadFile = (req, res) => {
    let studentID = mongoose.Types.ObjectId(req.body.studentID);
    let opportunityID = mongoose.Types.ObjectId(req.body.opportunityID);
    Application.findOne({studentID: studentID, opportunityID: opportunityID})
    .then(application => {
        // delete old file
       if ( application ){
            let oldFile = application.get(req.body.fileType)
            if(oldFile && oldFile.trim() != ''){
                Helper.deleteS3(oldFile);
              }
        }
        res.status(200).json({
            message: 'File upload successful',
            location: req.file.location
        })
    })
    .catch(err => {
        res.status(500).json({
            message: "File upload failed!",
            location:''
        });
    });
}

