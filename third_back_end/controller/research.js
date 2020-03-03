var mongoose = require("mongoose");
var async = require('async');

// Models
const Student = require('../models/student');
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
    Opportunity.create(opportunity, function (err, newOpt) {
        if (err) {
            console.log(err);
            rej(error);
        } else {
            res(newOpt);
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
            maxOpp: count
        });
    }).catch(error => {
        res.status(500).json({
            message: "Fetching Opportunities failed!"
        });
    });
}

// Get opportunity by id
exports.getOptByIds = (req, res) => {
    Opportunity.findById(req.query.optId, function (err, opt) {
        if (err) {
            res.status(500).json({
                message: "Fetching opportunity failed!",
                opt: new Opportunity(),
                application: new Application()
            });
        } else {
            Application.findOne({ studentID: req.query.studentId, opportunityID: req.query.optId })
                .then(application => {
                    console.log(application);
                    res.status(200).json({
                        message: "Opportunity fetched successfully",
                        opt: opt,
                        application: application
                    })
                })

        }
    });
}

// Get opportunity by id
exports.getCandidates = (req, res) => {
    Application.find({ opportunityID: req.params.id }, function (err, applications) {
        if (err) {
            res.status(500).json({
                message: "Fetching candidates failed!",
                tableRow: []
            });
        } else {
            async.each(applications, (application, cb) => {
                Student.findById(application.studentID, (err, student) => {
                    if (err) {
                        return cb(false);

                    } else {
                        data = {
                            student: student,
                            application: application
                        }
                        return cb(data)

                    }
                })
            }, (data) => {
                if (!data) {
                    res.status(500).json({
                        message: "Fetching candidates failed!",
                        tableRow: []
                    });
                } else {
                    res.status(200).json({
                        message: 'Fetching candidates successful',
                        tableRow: [data]
                    })
                }
            })

        }
    });
}

// create new application (or update if it is already there)
exports.createApplication = (req, res) => {
    const filter = {
        studentID: req.body.studentID,
        opportunityID: req.body.opportunityID
    };

    const update = {
        resume: req.body.resume,
        coverLetter: req.body.coverLetter,
        updateTime: new Date().toLocaleString()
    };

    const config = {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
    };

    // if find the old application then update the files and time
    Application.findOneAndUpdate(filter, update, config, (err, Application) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "Application create failed!",
                applicationID: ''
            });
        } else {
            console.log(Application);
            res.status(200).json({
                message: 'Application create successful',
                applicationID: Application._id
            })
        }
    })
}

// create multiple applications (or update if it is already there)
exports.createMultiApplications = (req, res) => {
    let filter = {
        studentID: req.body.studentID
    };

    const update = {
        resume: req.body.resume,
        coverLetter: req.body.coverLetter,
        updateTime: new Date().toLocaleString()
    };

    const config = {
        upsert: true,
        setDefaultsOnInsert: true
    };

    async.each(req.body.opportunityIDs, (optId, cb) => {
        filter.opportunityID = optId;
        Application.findOneAndUpdate(filter, update, config, (err, Application) => {
            if (err) {
                return cb(err);

            } else {
                return cb()

            }
        })
    }, err => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "Applications create failed!"
            });
        } else {
            res.status(200).json({
                message: 'Application create successful'
            })
        }
    })
}


// upload file to application
exports.uploadFile = (req, res) => {
    let studentID = mongoose.Types.ObjectId(req.body.studentID);
    let opportunityID = mongoose.Types.ObjectId(req.body.opportunityID);
    Application.findOne({ studentID: studentID, opportunityID: opportunityID })
        .then(application => {
            // delete old file
            if (application) {
                let oldFile = application.get(req.body.fileType)
                if (oldFile && oldFile.trim() != '') {
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
                location: ''
            });
        });
}

// upload file to multiple applications
exports.uploadFileMultiApp = (req, res) => {
    let studentID = mongoose.Types.ObjectId(req.body.studentID);
    let opportunityIDs = req.body.opportunityIDs;
    Application.find({ studentID: studentID, opportunityID: { $in: opportunityIDs } })
        .then(applications => {
            // delete old file
            if (applications.length > 0) {
                let oldFile;
                applications.forEach(function (item, index, input) {
                    oldFile = item.get(req.body.fileType)
                    if (oldFile && oldFile.trim() != '') {
                        Helper.deleteS3(oldFile);
                    }
                })
            }
            res.status(200).json({
                message: 'File upload to multiple applications successful',
                location: req.file.location
            })
        })
        .catch(err => {
            res.status(500).json({
                message: "File upload to multiple applications failed!",
                location: ''
            });
        });
}
