const PORT = 44444;
const HOST = '127.0.0.1';

const Client = require('node-rest-client').Client
const term = require('terminal-kit').terminal
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
    { name: 'type', alias: 't', type: Number },
    { name: 'param', alias: 'p', type: String},
    { name: 'owner', alias: 'o', type: String}
]
const options = commandLineArgs(optionDefinitions)

let client = new Client()


console.log(options.type)

let monitor = (cases) => {
    switch (cases) {
        case 1:
            setInterval(
                () => {
                    client.get("http://localhost:3000/monitor", (data, response) => {
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
                        objectID: options.param,
                        objectowner: options.owner
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
                console.log("calls")
                setInterval(
                    () => {
                        client.post("http://localhost:3000/monremoteUser", args, (data, response) => {
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
                    objectID: options.param,
                    objectowner: options.owner

                },
                headers: {
                    "Content-Type": "application/json"
                }
            }
            console.log("calls")
            setInterval(
                () => {
                    client.post("http://localhost:3000/monremoteUser", args, (data, response) => {
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
                    objectID: options.param
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }
            console.log("calls")
            setInterval(
                () => {
                    client.post("http://localhost:3000/monremoteUser", args, (data, response) => {
                        term.clear()
                        term.green(data.toString())
                    })
                }, 2000
            )
        }
            break
        case 5: {
            console.log("calls")
            let args = {
                data: {
                    type: "globalobject",
                    worldID: options.param
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }
            console.log("calls")
            setInterval(
                () => {
                    client.post("http://localhost:3000/monWorld", args, (data, response) => {
                        term.clear()
                        term.green(data.toString())
                    })
                }, 2000
            )
        }
            break
        case 6: {
            console.log("calls")
            let args = {
                data: {
                    type: "activemember",
                    worldID: options.param
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }
            console.log("calls")
            setInterval(
                () => {
                    client.post("http://localhost:3000/monWorld", args, (data, response) => {
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
