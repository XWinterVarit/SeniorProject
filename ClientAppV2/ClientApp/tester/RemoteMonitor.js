const PORT = 44444;
const HOST = '127.0.0.1';

const Client = require('node-rest-client').Client
const term = require('terminal-kit').terminal
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
    { name: 'type', alias: 't', type: Number },
    { name: 'port', alias: 'p', type: String},
    { name: 'owner', alias: 'o', type: String}
]
const options = commandLineArgs(optionDefinitions)


process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
});

let client = new Client()


//console.log(options.type)

let monitor = () => {
    setInterval(
        () => {
            client.get("http://localhost:"+options.port+"/remoteMonitor", (data, response) => {
                term.clear()
                term.green(data.toString())
            })
        }, 1000
    )
}
console.log("starting")
monitor()
