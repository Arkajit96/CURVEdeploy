// const io = require('../app');

const ioListener = {};
const usersConnected = [];

ioListener.setIO = function(io) {
    io.on('connection', (socket) => {
        console.log('New socket connection');
        socket.on('join', (user, callback) => {
            socket.join(user.trim());
            console.log('joined room ' + user);
            callback();
        })

        socket.on('send-message', (msg, callback) => {
            console.log('FROM SOCKET');
            console.log(msg.senderId);
            // io.emit('new-message', msg);
            let senderRoom = 'room' + msg.senderId + '';
            let recipRoom = 'room' + msg.recipientId + '';
            io.to(senderRoom).emit('new-message', msg);
            io.to(recipRoom).emit('new-message', msg);
            // io.to('abc').emit('new-message', msg);
        })
    });
}

module.exports = ioListener;