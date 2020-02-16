const Student = require('../models/student');
const Faculty = require('../models/faculty');
const Opportunities = require('../models/opportunities');

exports.createOpportunities = (req, res) => {
    const opportunities = new Opportunities({
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

    Opportunities.create(opportunities,function(err, newOpp) {
        if (err) {
            console.log(err);
            rej(error);
          } else {
            console.log(newOpp);
            // res(newOpp);
          }
    });
}