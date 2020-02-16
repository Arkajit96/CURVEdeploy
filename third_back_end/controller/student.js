const Student = require('../models/student');
const Faculty = require('../models/faculty');
const Opportunities = require('../models/opportunities');


exports.getOpportunities = (req, res) => {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const query = Opportunities.find();
    let fetchedOpps;
    if (pageSize && currentPage) {
        query.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    query.then(
        documents => {
            fetchedOpps = documents;
            return Opportunities.count();
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