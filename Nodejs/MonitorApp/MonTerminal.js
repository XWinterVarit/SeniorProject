const term = require('terminal-kit').terminal
const commandLineArgs = require('command-line-args')
const chalk = require('chalk')

const optionDefinitions = [
    { name: 'channal', alias: 'c', type: String },
    { name: 'port', alias: 'p', type: String},
]
const options = commandLineArgs(optionDefinitions)


process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
});

var io = require('socket.io')(options.port);
var monterminal = io
    .of('/monitor')
    .on('connection', function (socket) {
        console.log("peer connect to chat ")
        //console.log(CircularJSON.stringify(socket, null, 4))
        socket.on('terminal', (data) => {
            TerminalHandler.printlog(data.message, data.color)
        })
        socket.on('disconnect', ()=>{
            console.log("client disconnected")
        })
    })

class TerminalHandler {
    static printlog (message, color) {
        if (!color) {
            console.log(message)
        } else {
            console.log(chalk[color](message))
        }
    }
}
/*
setInterval(
    ()=>{
        monterminal.emit('terminal', {
            message: "greeting from server"
        })
    },1000
)
*/