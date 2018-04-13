const socket = require('socket.io-client')('http://localhost:45000/monitor');
const chalk = require('chalk')
socket.on('connect', () => {
    console.log("connect to monitor")
});
socket.on('terminal',(msg)=>{
    console.log(msg)
});
socket.on('disconnect', function(){});
socket.on('connect_error', (err)=>{
    console.log(chalk.red(err))
})
setInterval(
    ()=>{
        socket.emit('terminal', {
            message: "from client",
            color: "red"
        })
    },1000
)
