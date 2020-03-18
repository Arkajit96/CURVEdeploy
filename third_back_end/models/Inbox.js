const mongoose = require("mongoose");

const InboxSchema = new mongoose.Schema({
    user1_id: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    user1_name: {type: String},
    user1_email: {type: String},
    user2_id: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    user2_name: {type: String},
    user2_email: {type: String}
})

module.exports = mongoose.model("Inboxes", InboxSchema);
