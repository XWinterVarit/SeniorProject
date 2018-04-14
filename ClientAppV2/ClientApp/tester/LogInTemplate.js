const PORT = 44444;
const HOST = '127.0.0.1';

const Client = require('node-rest-client').Client
const term = require('terminal-kit').terminal
const chalk = require('chalk')
const commandLineArgs = require('command-line-args')

const optionDefinitions = [
    { name: 'port', alias: 'p', type: String},
    { name: 'username', alias: 'u', type: String}
]
const options = commandLineArgs(optionDefinitions)


process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
});

let client = new Client()

let login_templeted = new Map()
login_templeted.set(
    "Nutmos", {
        name: "Nutmos",
        userID: "5a5b4fe146f399051f99b4c1",
        password: "1234",
        worldID: "5a5b50a146f399051f99b4c4",
        IP: "127.0.0.1",
        PORT: "50001",

        objectID: "5aa543f6e6ca25042f106711",
        ownername: "Nutmos",
        ownerID:"5a5b4fe146f399051f99b4c1",
        objecttype:"remote",

        remoteobjectID: "5aa543f6e6ca25042f106711"
    }
)

login_templeted.set(
    "A",
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
    }
)

login_templeted.set(
    "B",
    {
        name: "B",
        userID: "5aa61db8ff33f805ac2d9ce9",
        password: "b",
        worldID: "5a5b50a146f399051f99b4c4",
        IP: "127.0.0.1",
        PORT: "50003",

        objectID: "5aa543f6e6ca25042f106711",
        ownername: "Nutmos",
        ownerID:"5a5b4fe146f399051f99b4c1",
        objecttype:"remote"
    }
)

login_templeted.set(
    "C",
    {
        name: "C",
        userID: "5aa61dc0ff33f805ac2d9cea",
        password: "c",
        worldID: "5a5b50a146f399051f99b4c4",
        IP: "127.0.0.1",
        PORT: "50004",

        objectID: "5aa543f6e6ca25042f106711",
        ownername: "Nutmos",
        ownerID:"5a5b4fe146f399051f99b4c1",
        objecttype:"remote"
    }
)

login_templeted.set(
    "D",
    {
        name: "D",
        userID: "5aa61dc9ff33f805ac2d9ceb",
        password: "d",
        worldID: "5a5b50a146f399051f99b4c4",
        IP: "127.0.0.1",
        PORT: "50005",

        objectID: "5aa543f6e6ca25042f106711",
        ownername: "Nutmos",
        ownerID:"5a5b4fe146f399051f99b4c1",
        objecttype:"remote"
    }
)

login_templeted.set(
    "E",
    {
        name: "E",
        userID: "5aa61dd1ff33f805ac2d9cec",
        password: "e",
        worldID: "5a5b50a146f399051f99b4c4",
        IP: "127.0.0.1",
        PORT: "50006",

        objectID: "5aa543f6e6ca25042f106711",
        ownername: "Nutmos",
        ownerID:"5a5b4fe146f399051f99b4c1",
        objecttype:"remote"
    }
)

login_templeted.set(
    "F",
    {
        name: "F",
        userID: "5aa61dd7ff33f805ac2d9ced",
        password: "f",
        worldID: "5a5b50a146f399051f99b4c4",
        IP: "127.0.0.1",
        PORT: "50007",

        objectID: "5aa543f6e6ca25042f106711",
        ownername: "Nutmos",
        ownerID:"5a5b4fe146f399051f99b4c1",
        objecttype:"remote"
    }
)


login_templeted.set(
    "G",
    {
        name: "G",
        userID: "5aa61ddfff33f805ac2d9cee",
        password: "g",
        worldID: "5a5b50a146f399051f99b4c4",
        IP: "127.0.0.1",
        PORT: "50008",

        objectID: "5aa543f6e6ca25042f106711",
        ownername: "Nutmos",
        ownerID:"5a5b4fe146f399051f99b4c1",
        objecttype:"remote"
    }
)



let sentSelected = async () => {
        let select_login = login_templeted.get(options.username)
    let port = options.port
        console.log(select_login)

        let args1 = {
            requestConfig: {timeout: 1000},
            response: {timeout: 2000},
            data: {
                name:select_login.name,
                userID:select_login.userID,
                password:select_login.password,
                IP: select_login.IP,
                PORT: select_login.PORT
            },
            headers: {
                "Content-Type": "application/json"
            }
        }
        await new Promise(resolve => {
            client.post("http://localhost:"+port+"/FORUI_LogIn", args1, (data, response) => {
                console.log(chalk.green(JSON.stringify(data.toString())))
                return resolve()
            }).on('error', (err) => {
                console.log("Error " + err)
                return resolve()
            })
        })


    let args2 = {
        requestConfig: {timeout: 1000},
        response: {timeout: 2000},
        data: {
            worldID:select_login.worldID,
        },
        headers: {
            "Content-Type": "application/json"
        }
    }
    await new Promise(resolve => {
        setTimeout(
            ()=>{
                client.post("http://localhost:"+port+"/FORUI_SETWORLD", args2, (data, response) => {
                    console.log(chalk.green(JSON.stringify(data.toString())))
                    return resolve()
                }).on('error', (err) => {
                    console.log("Error " + err)
                    return resolve()
                })
            },1000
        )
    })


    let args3 = {
        requestConfig: {timeout: 1000},
        response: {timeout: 2000},
        data: {
            objectID:select_login.objectID,
            ownername:select_login.ownername,
            objecttype:select_login.objecttype,
            ownerID:select_login.ownerID
        },
        headers: {
            "Content-Type": "application/json"
        }
    }
    await new Promise(resolve => {
        setTimeout(
            ()=>{
                client.post("http://localhost:"+port+"/FORUI_SETOBJECT", args3, (data, response) => {
                    console.log(chalk.green(JSON.stringify(data.toString())))
                    return resolve()
                }).on('error', (err) => {
                    console.log("Error " + err)
                    return resolve()
                })
            },3000
        )
    })
}
sentSelected()

