const PORT = 44444;
const HOST = '127.0.0.1';

const Client = require('node-rest-client').Client
const term = require('terminal-kit').terminal
let client = new Client()

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

monitor()
