const PORT = 44444;
const HOST = '127.0.0.1';

const Client = require('node-rest-client').Client
const term = require('terminal-kit').terminal
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
    { name: 'id', alias: 'i', type: String },
    { name: 'ownername', alias: 'o', type: String}
]
const options = commandLineArgs(optionDefinitions)

let client = new Client()


console.log(options)

let monitor = () => {
    setInterval(
        () => {
            let args = {
                data: {
                    objectID: options.id,
                    ownername: options.ownername
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }
            console.log("starting...")
            client.post("http://localhost:80/MONITOR_REMOTEDESKTOPOBJ", args,(data, response) => {
                term.clear()
                term.green(data.toString())
            })
        }, 1000
    )
}
console.log("starting")
monitor()
