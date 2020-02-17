// const io = require('../app');

const ioListener = {};

ioListener.setIO = function(io) {
    io.on('connection', (socket) => {
        console.log('New socket connection');
    })
}

module.exports = ioListener;