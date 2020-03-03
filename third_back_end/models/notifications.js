const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
    user1: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    user2: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    messages: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }
    ]
})

module.exports = mongoose.model("Notifications", NotificationSchema);
