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
    Opportunity.create(opportunity,function(err, newOpp) {
        if (err) {
            console.log(err);
            rej(error);
          } else {
            console.log(newOpp);
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


// create the application
exports.createApplication  = (req, res) => {
    console.log(req)
    // const application = new Application({
    //     studentID: this.data.student._id,
    //     opportunityID: this.data.opt.id,
    //     resume: this.data.student.resume,
    //     coverLetter: '',
    //     createTime:''
    // })
}
// upload Resume to application
exports.uploadResume = async (req, res) => {
    let studentID = mongoose.Types.ObjectId(req.body.studentID);
    try {
      let application = await Application.findOneAndUpdate({studentID: studentID}, {resume: req.file.location});
      let oldFile = application.resume;
      if(oldFile && oldFile.trim() != ''){
        Helper.deleteS3(oldFile);
      }
      application.resume = req.file.location;
      res.state(200).json({
          message: 'Resume upload successful'
      })
    } catch(e) {
      console.log(e);
      res.status(500).json({
        message: "Resume upload failed!"
    });
    }
}

// upload CV to application
exports.uploadCV = async (req, res) => {
    let studentID = mongoose.Types.ObjectId(req.body.studentID);
    try {
      let application = await Application.findOneAndUpdate({studentID: studentID}, {coverLetter: req.file.location});
      let oldFile = application.coverLetter;
      if(oldFile && oldFile.trim() != ''){
        Helper.deleteS3(oldFile);
      }
      application.coverLetter = req.file.location;
      res.state(200).json({
          message: 'Cover letter upload successful'
      })
    } catch(e) {
      console.log(e);
      res.status(500).json({
        message: "Cover letter upload failed!"
    });
    }
}