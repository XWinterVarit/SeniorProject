const PORT = 44444;
const HOST = '127.0.0.1';

const Client = require('node-rest-client').Client
const term = require('terminal-kit').terminal
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
    { name: 'type', alias: 't', type: String },
]
const options = commandLineArgs(optionDefinitions)

let client = new Client()


console.log(options.type)

let demoselector = (cases) => {
    switch (cases) {
        case "createUser":
        {
            let args = {
                data: {
                    name: "Nutmos",
                    emailaddr: "1234@hotmail.com",
                    password: "Good"
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }
            client.post("http://localhost:80/createUser", args, (data, response) => { })
            args = {
                data: {
                    name: "Wanwipa",
                    emailaddr: "5678@hotmail.com",
                    password: "well"
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }
            client.post("http://localhost:80/createUser", args, (data, response) => { })
            args = {
                data: {
                    name: "BoonLEDTV",
                    emailaddr: "91011@hotmail.com",
                    password: "best"
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }
            client.post("http://localhost:80/createUser", args, (data, response) => { })
        }
            break
        case "createWorld":
        {
            let args = {
                data: {
                    name: "CPE100",
                    adminpassword: "happyface",
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }
            client.post("http://localhost:80/createWorld", args, (data, response) => { })

        }
            break
        case "addMemberInvitation":
        {
            let args = {
                data: {
                    name: "Nutmos",
                    worldname: "CPE100",
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }
            client.post("http://localhost:80/addMemberInvitation", args, (data, response) => { })
            args = {
                data: {
                    name: "Wanwipa",
                    worldname: "CPE100",
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }
            client.post("http://localhost:80/addMemberInvitation", args, (data, response) => { })
            args = {
                data: {
                    name: "BoonLEDTV",
                    worldname: "CPE100",
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }
            client.post("http://localhost:80/addMemberInvitation", args, (data, response) => { })
        }
            break
        case "acceptMember":
        {
            let args = {
                data: {
                    name: "Nutmos",
                    worldname: "CPE100",
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }
            client.post("http://localhost:80/acceptMember", args, (data, response) => { })
            args = {
                data: {
                    name: "Wanwipa",
                    worldname: "CPE100",
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }
            client.post("http://localhost:80/acceptMember", args, (data, response) => { })
            args = {
                data: {
                    name: "BoonLEDTV",
                    worldname: "CPE100",
                },
                headers: {
                    "Content-Type": "application/json"
                }
            }
            client.post("http://localhost:80/acceptMember", args, (data, response) => { })
        }

            break
    }
}

demoselector(options.type)

