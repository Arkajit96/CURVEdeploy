var mongoose = require("mongoose");

var applicationSchema = new mongoose.Schema({
    studentID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    },
    opportunityID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "opportunity"
    },
    resume: { type: String, default: ''},
    coverLetter: { type: String, default: ''},
    updateTime: { type: String, default: new Date().toLocaleString()},
    status: { type: String, default: 'submitted'}
});


module.exports = mongoose.model("application", applicationSchema);