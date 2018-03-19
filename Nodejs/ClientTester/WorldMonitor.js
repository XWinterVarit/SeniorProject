const PORT = 44444;
const HOST = '127.0.0.1';

const Client = require('node-rest-client').Client
const term = require('terminal-kit').terminal
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
    { name: 'id', alias: 'i', type: String }
]
const options = commandLineArgs(optionDefinitions)

let client = new Client()


console.log(options)

let monitor = () => {
    setInterval(
        () => {
            let args = {
                data: {
                    worldID: options.id,
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }
            console.log("starting...")
                client.post("http://localhost:3000/MONITOR_WORLD", args,(data, response) => {
                    term.clear()
                    term.green(data.toString())
                })
        }, 1000
    )
}
console.log("starting")
monitor()
