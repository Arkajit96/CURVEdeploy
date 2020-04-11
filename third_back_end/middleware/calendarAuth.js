const googleUtil = require('../helpers/google-util');

module.exports = async (req, res, next) => {
    googleUtil.getGoogleAccountFromCode(req.body.code, (err, res) => {
        if (err) {
            res.status(401).json({ message: "You are not authenticated!" });
        } else {
            req.session.calenderUser = res;
        }
        next();
    });
}