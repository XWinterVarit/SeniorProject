const PORT = 44444;
const HOST = '127.0.0.1';

const Client = require('node-rest-client').Client
const term = require('terminal-kit').terminal
const chalk = require('chalk')
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

let alldata = [
    {
        name: "Nutmos",
        userID: "5a5b4fe146f399051f99b4c1",
        password: "1234",
        worldID: "5a5b50a146f399051f99b4c4",
        IP: "127.0.0.1",
        PORT: "50001",

        objectID: "5aa543f6e6ca25042f106711",
        ownername: "Nutmos",
        ownerID:"5a5b4fe146f399051f99b4c1",
        objecttype:"remote"
    },
    {
        name: "A",
        userID: "5aa61dabff33f805ac2d9ce8",
        password: "a",
        worldID: "5a5b50a146f399051f99b4c4",
        IP: "127.0.0.1",
        PORT: "50002",

        objectID: "5aa543f6e6ca25042f106711",
        ownername: "Nutmos",
        ownerID:"5a5b4fe146f399051f99b4c1",
        objecttype:"remote"
    },
    {
        name: "B",
        userID: "5aa61dabff33f805ac2d9ce9",
        password: "b",
        worldID: "5a5b50a146f399051f99b4c4",
        IP: "127.0.0.1",
        PORT: "50003",

        objectID: "5aa543f6e6ca25042f106711",
        ownername: "Nutmos",
        ownerID:"5a5b4fe146f399051f99b4c1",
        objecttype:"remote"
    },
    {
        name: "C",
        userID: "5aa61dabff33f805ac2d9cea",
        password: "c",
        worldID: "5a5b50a146f399051f99b4c4",
        IP: "127.0.0.1",
        PORT: "50004",

        objectID: "5aa543f6e6ca25042f106711",
        ownername: "Nutmos",
        ownerID:"5a5b4fe146f399051f99b4c1",
        objecttype:"remote"
    },
    {
        name: "D",
        userID: "5aa61dabff33f805ac2d9ceb",
        password: "d",
        worldID: "5a5b50a146f399051f99b4c4",
        IP: "127.0.0.1",
        PORT: "50005",

        objectID: "5aa543f6e6ca25042f106711",
        ownername: "Nutmos",
        ownerID:"5a5b4fe146f399051f99b4c1",
        objecttype:"remote"
    },
    {
        name: "E",
        userID: "5aa61dabff33f805ac2d9cec",
        password: "e",
        worldID: "5a5b50a146f399051f99b4c4",
        IP: "127.0.0.1",
        PORT: "50006",

        objectID: "5aa543f6e6ca25042f106711",
        ownername: "Nutmos",
        ownerID:"5a5b4fe146f399051f99b4c1",
        objecttype:"remote"
    },
    {
        name: "F",
        userID: "5aa61dabff33f805ac2d9ced",
        password: "f",
        worldID: "5a5b50a146f399051f99b4c4",
        IP: "127.0.0.1",
        PORT: "50007",

        objectID: "5aa543f6e6ca25042f106711",
        ownername: "Nutmos",
        ownerID:"5a5b4fe146f399051f99b4c1",
        objecttype:"remote"
    },
    {
        name: "G",
        userID: "5aa61dabff33f805ac2d9cee",
        password: "g",
        worldID: "5a5b50a146f399051f99b4c4",
        IP: "127.0.0.1",
        PORT: "50008",

        objectID: "5aa543f6e6ca25042f106711",
        ownername: "Nutmos",
        ownerID:"5a5b4fe146f399051f99b4c1",
        objecttype:"remote"
    }
]
let sentAll = async () => {

    for (let i of alldata) {
        console.log(i)

        let args = {
            requestConfig: {timeout: 1000},
            response: {timeout: 2000},
            data: i,
            headers: {
                "Content-Type": "application/json"
            }
        }
        await new Promise(resolve => {
            client.post("http://localhost:"+i.PORT+"/setFirstStart",args, (data, response) => {
                console.log(chalk.green(JSON.stringify(data.toString())))
                return resolve()
            }).on('error', (err) => {
                console.log("Error " + err)
                return resolve()
            })
        })

    }
}

let sent = async () => {
    /*
    let args = {
        requestConfig: {timeout: 1000},
        response: {timeout: 2000},
        data: {
            name: "David",
            userID: "5a4f10dcd61917007cf00bfa",
            password: "1234",
            worldID: "5a5b50a146f399051f99b4c4",
            IP: "docker.for.mac.localhost",
            PORT: "50001",

            objectID: "5aa24abfcd525e004c28b066",
        },
        headers: {
            "Content-Type": "application/json"
        }
    }
    */
    let args = {
        requestConfig: {timeout: 1000},
        response: {timeout: 2000},
        data: {
            name: "Nutmos",
            userID: "5a5b4fe146f399051f99b4c1",
            password: "1234",
            worldID: "5a5b50a146f399051f99b4c4",
            IP: "docker.for.mac.localhost",
            PORT: "50001",

            objectID: "5aa543f6e6ca25042f106712",
        },
        headers: {
            "Content-Type": "application/json"
        }
    }


    await new Promise(resolve => {

            client.post("http://localhost:"+50001+"/setFirstStart",args, (data, response) => {
                console.log(chalk.green(JSON.stringify(data.toString())))
                return resolve()
            }).on('error', (err) => {
                console.log("Error " + err)
                return resolve()
            })

    })
    console.log(chalk.red("pass"))
    args = {
        data: {
            name: "Wanwipa",
            userID: "5a5b4fe146f399051f99b4c2",
            password: "5678",
            worldID: "5a5b50a146f399051f99b4c4",
            IP: "docker.for.mac.localhost",
            PORT: "50002"
        },
        headers: {
            "Content-Type": "application/json"
        }
    }
    await new Promise(resolve => {
        client.post("http://localhost:" + 50002 + "/setFirstStart", args, (data, response) => {
            //console.log(chalk.green(JSON.stringify(data)))
            return resolve()
        }).on('error', (err) => {
            console.log("Error " + err)
            return resolve()
        })
    })
    args = {
        data: {
            name: "BoonLEDTV",
            userID: "5a5b4fe146f399051f99b4c3",
            password: "91011",
            worldID: "5a5b50a146f399051f99b4c4",
            IP: "docker.for.mac.localhost",
            PORT: "50003"
        },
        headers: {
            "Content-Type": "application/json"
        }
    }
    await new Promise(resolve => {
        client.post("http://localhost:" + 50003 + "/setFirstStart", args, (data, response) => {
            //console.log(chalk.green(JSON.stringify(data)))
            return resolve()
        }).on('error', (err) => {
            console.log("Error " + err)
            return resolve()
        })
    })
    args = {
        data: {
            name: "cheevarit",
            userID: "5a4d13a4daac5f00d435a784",
            password: "1213",
            worldID: "5a5837f7e79e0d017e88cd8b",
            IP: "docker.for.mac.localhost",
            PORT: "50004"
        },
        headers: {
            "Content-Type": "application/json"
        }
    }
    await new Promise(resolve => {
        client.post("http://localhost:" + 50004 + "/setFirstStart", args, (data, response) => {
            //console.log(chalk.green(JSON.stringify(data)))
            return resolve()
        }).on('error', (err) => {
            console.log("Error " + err)
            return resolve()
        })
    })
    args = {
        data: {
            name: "Nutmos",
            userID: "5a5b4fe146f399051f99b4c1",
            password: "1415",
            worldID: "5a5b50a146f399051f99b4c4",
            IP: "docker.for.mac.localhost",
            PORT: "50005"
        },
        headers: {
            "Content-Type": "application/json"
        }
    }
    await new Promise(resolve => {
        client.post("http://localhost:" + 50005 + "/setFirstStart", args, (data, response) => {
            //console.log(chalk.green(JSON.stringify(data)))
            return resolve()
        }).on('error', (err) => {
            console.log("Error " + err)
            return resolve()
        })
    })

}



console.log("starting")
sentAll()
