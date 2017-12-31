let PORT = 44444;
let HOST = '127.0.0.1';

let dgram = require('dgram')
let server = dgram.createSocket('udp4')
let count = 0;
server.on('message', function (message, remote) {
    //console.log(remote.address + ':' + remote.port +' - ' + message);
    count++
    if (count % 1000 === 0)
        console.log("receive " + count);
});

server.bind(PORT, HOST);
