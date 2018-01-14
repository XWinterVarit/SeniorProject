const PORT = 44444;
const HOST = '127.0.0.1';

const Client = require('node-rest-client').Client
const term = require('terminal-kit').terminal
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
    { name: 'type', alias: 't', type: Number },
]
const options = commandLineArgs(optionDefinitions)

let client = new Client()


console.log(options.type)

let monitor = (cases) => {
    switch (cases) {
        case 1:
            setInterval(
                () => {
                    client.get("http://localhost:80/monitor", (data, response) => {
                        term.clear()
                        term.green(data.toString())
                    })
                }, 1000
            )
            break
        case 2: {
                let args = {
                    data: {
                        type: "activemember",
                        objectID: "5a53549dd1e30700462426d8",
                        objectowner: "cheevarit"
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
                console.log("calls")
                setInterval(
                    () => {
                        client.post("http://localhost:80/monremoteUser", args, (data, response) => {
                            term.clear()
                            term.green(data.toString())
                        })
                    }, 2000
                )
        }
            break
        case 3: {
            let args = {
                data: {
                    type: "object",
                    objectID: "5a53549dd1e30700462426d8",
                    objectowner: "cheevarit"

                },
                headers: {
                    "Content-Type": "application/json"
                }
            }
            console.log("calls")
            setInterval(
                () => {
                    client.post("http://localhost:80/monremoteUser", args, (data, response) => {
                        term.clear()
                        term.green(data.toString())
                    })
                }, 2000
            )
        }
            break
        case 4: {
            let args = {
                data: {
                    type: "globalobject",
                    objectID: "5a53549dd1e30700462426d8"
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }
            console.log("calls")
            setInterval(
                () => {
                    client.post("http://localhost:80/monremoteUser", args, (data, response) => {
                        term.clear()
                        term.green(data.toString())
                    })
                }, 2000
            )
        }
            break
    }
}
console.log("starting")
monitor(options.type)
