var mongoose = require("mongoose");
var async = require('async');

// Models
const Student = require('../models/student');
const Faculty = require('../models/faculty');
const Opportunity = require('../models/opportunity');
const Application = require('../models/application');

const Helper = require('../helpers/index');

// Create new opportunities
exports.createOrUpdateOpportunity = (req, res) => {
    const filter = {
        creator: req.body.faculty._id,
    };

    const update = {
        name: req.body.name,
        school: req.body.faculty.school,
        department: req.body.faculty.department,
        expireTime: req.body.expireTime,
        summary: req.body.summary,
    };

    const config = {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true
    };

    Opportunity.findOneAndUpdate(filter, update, config, (err, opportunity) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "Opportunity update failed!",
                opportunity: opportunity,
                faculty: req.body.faculty
            });
        } else {
            Faculty.findByIdAndUpdate(req.body.faculty._id,
                { opportunity: opportunity._id }, {}, (err, faculty) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({
                            message: "Opportunity update failed!",
                            opportunity: opportunity,
                            faculty: req.body.faculty
                        });
                    }
                    else {
                        res.status(200).json({
                            message: 'Opportunity create successful',
                            opportunity: opportunity,
                            faculty: faculty
                        })
                    }
                })
        }
    })
}

// Upload opportunities Icon
exports.uploadOpportunityIcon = (req, res) => {
    const filter = {
        creator: req.body.facultyId
    };

    const update = {
        icon: req.file.location
    };

    const config = {
        upsert: true,
        setDefaultsOnInsert: true
    };

    Opportunity.findOneAndUpdate(filter, update, config, (err, opportunity) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "Icon upload failed!",
                opportunity: null
            });
        } else {
            let oldImg = opportunity.icon;
            if (oldImg && oldImg.trim() != '') {
                Helper.deleteS3(oldImg);
            }
            opportunity.icon = req.file.location;

            res.status(200).json({
                message: 'Icon upload successful',
                opportunity: opportunity,
            })
        }
    })
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

//get opt by opt id
exports.getOptByIds = (req, res) => {
    Opportunity.findById(req.params.optId, function (err, opt) {
        if (err) {
            res.status(500).json({
                message: "Fetching opportunity failed!",
                opt: new Opportunity(),
            });
        } else {
            res.status(200).json({
                message: "Opportunity fetched successfully",
                opt: opt,
            })
        }
    });
}

// Get opt and application
exports.getApplicationInfo = (req, res) => {
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
                            userId: student.user_id,
                            applicationID: application._id,
                            name: student.first_name + " " + student.middle_name + " " + student.last_name,
                            address: student.address,
                            major: student.major,
                            status: application.status
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
        updateTime: new Date().toLocaleString(),
        status: 'Submitted'
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
        updateTime: new Date().toLocaleString(),
        status: 'Submitted'
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


exports.updateApplicationStatus = (req, res) => {
    const update = {
        status: req.body.status,
        updateTime: new Date().toLocaleString()
    };

    const config = {
        new: true
    };

    Application.findByIdAndUpdate(req.body.applicationID, update, config, (err, application) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                message: "Application status update failed!",
                application: ''
            });
        } else {
            res.status(200).json({
                message: 'Application status update successful',
                application: application
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
