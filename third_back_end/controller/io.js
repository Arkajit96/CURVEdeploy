// const io = require('../app');

const ioListener = {};
const usersConnected = [];

ioListener.setIO = function(io) {
    io.on('connection', (socket) => {
        socket.on('join', (user, callback) => {
            socket.join(user.trim());
            callback();
        })

        socket.on('send-message', (msg, callback) => {
            let senderRoom = 'room' + msg.senderId + '';
            let recipRoom = 'room' + msg.recipientId + '';
            io.to(senderRoom).emit('new-message', msg);
            io.to(recipRoom).emit('new-message', msg);
        })
    });
}

module.exports = ioListener;