const socket = require('socket.io-client')('http://localhost:8080/chat');
socket.on('connect', () => {
    console.log("connect to monitor")
});
socket.on('json',(msg)=>{
    console.log(msg)
});
/*
setInterval(
    ()=>{
        console.log("senting")
        socket.emit("chat message", {
            name: "cheevarit",
            lastname: "rodnuson"
        })
    },1000
)*/
socket.on('chat message', (data)=>{
    console.log(data)
})
socket.on('disconnect', function(){});