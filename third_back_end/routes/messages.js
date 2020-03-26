const express = require("express");
const router  = express.Router();
var mongoose = require("mongoose");
const Helper = require('../helpers/index');
const messageController = require('../controller/messageController');
const moment = require('moment');

// MODELS
const Students = require("../models/student");
const Notifications = require("../models/notifications");
const Messages = require("../models/message");
const Faculty = require('../models/faculty')
const Inboxes = require('../models/inbox');
const User = require('../models/user');

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
    const sentAt = moment().format('MMM D LT');
    // console.log(moment().format('MMM D LT'));

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
        messages.sort((msg1, msg2) => {
            if(msg1.timestamp > msg2.timestamp) {
                return 1;
            } else {
                return -1;
            }
        })
        res.send(messages);
    } catch(e) {
        res.status(400).send(e);
    }
})  

router.get('/getInbox/:userid', checkAuth, async (req, res) => {
    const userid = req.params.userid;
    try{
        let inbox = await Inboxes.find({$or: [
            {user1_id: userid},
            {user2_id: userid}
        ]});
        console.log(inbox);
        const timestamp = inbox[0].timestamp;

        inbox = inbox.map((users) => {
            if(users.user1_id == userid) {
                return {
                    id: users.user2_id,
                    name: users.user2_name,
                    email: users.user2_email,
                    time: users.timestamp
                };
            } else {
                return {
                    id: users.user1_id,
                    name: users.user1_name,
                    email: users.user1_email,
                    time: users.timestamp
                }
            }
        })
        res.send(inbox);
    } catch(e) {
        res.status(400).send(e);
    }
})

router.get('/unreadMessages/:id', checkAuth, async (req, res) => {
    let id = req.params.id;
    try {
      let user = await User.findById(id);
      res.send(user.unreadMessages);
    } catch(e) {
      res.status(400).send('error');
    }
  });

router.post('/readMessage', checkAuth, async (req, res) => {
    let userId = req.body.userId;
    let messageId = req.body.messageId

    try{
        let user = await User.findById(userId);
        console.log(user);
        let newMessages = user.unreadMessages;
        newMessages = newMessages.filter((msg) => {
            return msg != messageId;
        })
        user.unreadMessages = newMessages;
        user.save();
        res.send(newMessages);
    } catch (e) {
        res.status(404).send('error');
    }
})

router.get('/searchFaculty/:query', checkAuth, async (req, res) => {
    const query = req.params.query;
    Helper.searchFaculty(query)
        .then((fac) => {
            res.send(fac);
        })
        .catch((e) => {
            res.status(400).send(e);
        })
})

module.exports = router;