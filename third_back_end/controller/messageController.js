const Notifications = require('../models/notifications');
const Messages = require('../models/message');

let messageController = {};

messageController.createNewNotifications = async (recipient, sender) => {
    return new Promise((res, rej) => {
        try{
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

// messageController.createNewMessage = async (recipient, sender, text, sentAt) => {
//     return new Promise((res, rej) => {
//         try {
//             let newMessage = Messages.create({
//                 senderId: sender,
//                 recipientId: recipient,
//                 text: text,
//                 sentAt: sentAt
//             });
//             newMessage.then((msg) => {
//                     // res(msg);
//                     let notifications = Notifications.findOne({$or: [
//                         {user1: sender, user2: recipient},
//                         {user2: sender, user1: recipient}
//                     ]}, (notification) => {
//                         console.log(notification);
//                         if(!notification){
//                             messageController.createNewNotifications(recipient, sender)
//                                 .then((newNotification) => {
//                                     console.log(newNotification);
//                                     let msgs = newNotification.messages.push(msg);
//                                     console.log('new notification created')
//                                     Notifications.findOneAndUpdate({$or: [
//                                         {user1: sender, user2: recipient},
//                                         {user2: sender, user1: recipient}
//                                     ]}, {messages: msgs});
//                                     res(msg);
//                                 })
//                                 .catch((e) => {
//                                     rej(e)
//                                 })
//                         } else {
//                             console.log('else');
//                             let msgs = notification.messages.push(msg);
//                             Notifications.findByIdAndUpdate(notification._id, {messages: msg});
//                             res(msg);
//                         }
//                     });
                    
//                 })
//                 .catch((e) => { rej(e) })
//         } catch(e) {
//             rej(e);
//         }
//     })
// }

messageController.createNewMessage = function(recipient, sender, text, sentAt) {
    return new Promise(async (res, rej) => {
        try {
            let notification = await findNotification(recipient, sender);
            if(!notification) {
                messageController.createNewNotifications(recipient, sender)
                    .then(async (newNotification) => {
                        notification = await findNotification(recipient, sender);
                        console.log(notification);
                        const newMessage = await addMessage(notification, recipient, sender, text, sentAt);
                        res(newMessage);
                    }).catch((e) => {rej(e)});
            } else {
                console.log(notification);
                const newMessage = await addMessage(notification, recipient, sender, text, sentAt);
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
            sentAt: sentAt
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

module.exports = messageController;