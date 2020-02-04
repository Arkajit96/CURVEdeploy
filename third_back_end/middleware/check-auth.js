let config = require('dotenv').config().parsed;
const jwt = require("jsonwebtoken");
const config = require('dotenv').config().parsed;

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    console.log(config.SECRETKEY);
    const decodedToken = jwt.verify(token, config.SECRETKEY);
    req.userData = { email: decodedToken.email, userId: decodedToken.userId };
    next();
  } catch (error) {
    // console.log(error);
    res.status(401).json({ message: "You are not authenticated!" });
  }
};