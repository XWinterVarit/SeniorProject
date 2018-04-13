const socket = require('socket.io-client')('http://localhost:45000/monitor');
socket.on('connect', () => {
    console.log("connect to monitor")
});
socket.on('terminal',(msg)=>{
    console.log(msg)
});
socket.on('disconnect', function(){});