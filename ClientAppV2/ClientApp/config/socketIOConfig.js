let laterExports = {
    io: null
}
class SocketIOConfig_Class {
    constructor (PORT) {
        console.log("SocketIO listening at PORT : " + PORT)
        this.io = require('socket.io')(PORT)
        laterExports.io = this.io
    }
}


module.exports = (PORT) => {return new SocketIOConfig_Class(PORT)}
module.exports.socketIO = laterExports