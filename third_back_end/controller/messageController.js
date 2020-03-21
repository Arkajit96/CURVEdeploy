const Notifications = require('../models/notifications');
const Inboxes = require('../models/inbox');
const Messages = require('../models/message');
const Helpers = require('../helpers/index');

let messageController = {};

messageController.createNewNotifications = async (recipient, sender) => {
    return new Promise(async (res, rej) => {
        try{
            let Sender = await Helpers.findUsers([sender])[0];
            console.log(Sender)
            let Recipient = await Helpers.findUsers([recipient])[0];
            console.log(Recipient);
            let user1 = {
                user_id: Sender.user_id,
                name: Sender.first_name + ' ' + Sender.last_name,
                email: Sender.email
            }
            let user2 = {
                user_id: Recipient.user_id,
                name: Recipient.first_name + ' ' + Recipient.last_name,
                email: Recipient.email
            }
            let notification = Notifications.create({
                user1: sender,
                user2: recipient,
                messages: []
            }, (newNotification) => {
                res(newNotification);
            })
        } catch(e) {
            rej(e);
        }
    })
}

messageController.createNewInbox = async (recipient, sender) => {
    return new Promise(async (res, rej) => {
        try{
            console.log("in create inbox")
            // let Sender = await Helpers.findUsers([sender])[0];
            let Sender = {};
            let Recipient = {};
            Helpers.findUsers([sender])
                .then((send) => {
                    Sender = send[0];
                    Helpers.findUsers([recipient])
                        .then((recip) => {
                            Recipient = recip[0];
                            let inbox = Inboxes.create({
                                user1_id: Sender.user_id,
                                user1_name: Sender.first_name + ' ' + Sender.last_name,
                                user1_email: Sender.email,
                                user2_id: Recipient.user_id,
                                user2_name: Recipient.first_name + ' ' + Recipient.last_name,
                                user2_email: Recipient.email
                            }, (newInbox) => {
                                res(newInbox)
                                console.log("New Inbox ", inbox);
                            });
                        })
                });
        } catch(e) {
            console.log(e);
            rej(e);
        }
    })
}

// messageController.createNewMessage = function(recipient, sender, text, sentAt) {
//     return new Promise(async (res, rej) => {
//         try {
//             let notification = await findNotification(recipient, sender);
//             if(!notification) {
//                 messageController.createNewNotifications(recipient, sender)
//                     .then(async (newNotification) => {
//                         notification = await findNotification(recipient, sender);
//                         console.log(notification);
//                         const newMessage = await addMessage(notification, recipient, sender, text, sentAt);
//                         res(newMessage);
//                     }).catch((e) => {rej(e)});
//             } else {
//                 console.log(notification);
//                 const newMessage = await addMessage(notification, recipient, sender, text, sentAt);
//                 res(newMessage);
//             }
            
//         } catch(e) {
//             rej(e);
//         }
//     })
// }

messageController.createNewMessage = function(recipient, sender, text, sentAt) {
    return new Promise(async (res, rej) => {
        try {
            let inbox = await findInbox(recipient, sender);
            console.log(inbox);
            if(!inbox) {
                console.log("HERE");
                await this.createNewInbox(recipient, sender)
                    .then((newInbox) => {
                        const newMessage = addMessage(inbox, recipient, sender, text, sentAt);
                        res(newMessage);
                    })
                    .catch((e) => {
                        rej(e);
                    })
            }
            else {
                const newMessage = addMessage(inbox, recipient, sender, text, sentAt);
                res(newMessage);
            }
        } catch(e) {
            rej(e);
        }
    })
}

async function addMessage(notification, recipient, sender, text, sentAt) {
    try{
        const message = await Messages.create({
            senderId: sender,
            recipientId: recipient,
            text: text,
            sentAt: sentAt,
            timestamp: new Date().getTime()
        });
        return message;
    } catch(e) {
        return e;
    }
}

async function findNotification(recipient, sender) {
    try {
        let notification = await Notifications.findOne({$or: [
            {user2: sender, user1: recipient},
            {user1: sender, user2: recipient}
        ]});
        if(!notification){
            return null;
        } else {
            return notification;
        }
    } catch(e) {
        return null;
    }
}

async function findInbox(recipient, sender) {
    try {
        let notification = await Inboxes.findOne({$or: [
            {user2_id: sender, user1_id: recipient},
            {user1_id: sender, user2_id: recipient}
        ]});
        if(!notification){
            return null;
        } else {
            return notification;
        }
    } catch(e) {
        return null;
    }
}

module.exports = messageController;