const PORT = 44444;
const HOST = '127.0.0.1';

const Client = require('node-rest-client').Client
const term = require('terminal-kit').terminal
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
    { name: 'param', alias: 'p', type: String }
]
const options = commandLineArgs(optionDefinitions)

let client = new Client()


console.log(options)

let monitor = () => {
    setInterval(
        () => {
            client.get("http://localhost:80/monitor", (data, response) => {
                term.clear()
                term.green(data.toString())
            })
        }, 1000
    )
}
console.log("starting")
monitor()







