const express = require("express");
const router  = express.Router();
var mongoose = require("mongoose");
const Helper = require('../helpers/index');
const messageController = require('../controller/messageController');

// MODELS
const Students = require("../models/student");
const Notifications = require("../models/notifications");
const Messages = require("../models/message");
const Faculty = require('../models/faculty')

// MIDDLEWARE
const checkAuth = require("../middleware/check-auth");

router.post('/createNotification', checkAuth, async (req, res) => {
    messageController.createNewNotifications(req.body.recipientId, req.body.senderId)
    .then((newNotification) => {res.send(newNotification)})
    .catch((e) => {res.send(e)});
})

router.post('/get/notification', checkAuth, async (req, res) => {
    try {
        let notifications = await Notifications.find({$or: [
            { sender: req.body.senderId, recipient: req.body.recipientId },
            { sender: req.body.recipientId, recipient: req.body.senderId} 
        ]});
        res.send(notifications);
    } catch(e) {
        res.send(e);
    }
})

router.post('/sendMessage', checkAuth, async (req, res) => {
    const senderId = req.body.senderId;
    const recipientId = req.body.recipientId;
    const text = req.body.text;
    const sentAt = new Date();

    try {
        messageController.createNewMessage(recipientId, senderId, text, sentAt)
            .then((newMessage) => {
                res.send(newMessage);
            }).catch((e) => {
                res.status(500).send(e);
            })
    } catch(e) {
        res.status(400).send(e);
    }
});

router.post('/getMessages', checkAuth, async (req, res) => {
    const user1 = req.body.senderId;
    const user2 = req.body.recipientId;
    
    try {
        let sentMessages = await Messages.find({recipientId:user2, senderId: user1});
        let recievedMessages = await Messages.find({recipientId:user1, senderId: user2});

        let messages = sentMessages.concat(recievedMessages);
        res.send(messages);
    } catch(e) {
        res.status(400).send(e);
    }
})

router.get('/getInbox/:userid', checkAuth, async (req, res) => {
    console.log(req.params.userid);
    const userid = req.params.userid;
    try {
        let notifications = await Notifications.find({$or: [
            {user1: userid},
            {user2: userid}
        ]})
        notifications = notifications.map((user) => {
            return userid == user.user1 ? user.user2 : user.user1;
            // userid = userid == user.user1 ? user.user2 : user.user1;
        })
        console.log(notifications);
        Helper.findUsers(notifications)
            .then((inbox) => {
                res.send(inbox);
            })
            .catch((e) => {
                res.status(400).send(e);
            })
        // res.send(notifications);
    } catch(e) {
        res.status(400).send(e);
    }
})

module.exports = router;