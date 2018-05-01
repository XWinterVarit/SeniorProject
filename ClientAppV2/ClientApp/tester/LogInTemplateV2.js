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
        password: "1234",
        worldname: "CPE200",
        IP: "10.2.11.38",
        PORT: "50001",
    }
)

login_templeted.set(
    "A",
    {
        name: "A",
        password: "a",
        worldname: "CPE200",
        IP: "10.2.11.38",
        PORT: "50002",
    }
)

login_templeted.set(
    "B",
    {
        name: "B",
        password: "b",
        worldname: "CPE200",
        IP: "10.2.11.38",
        PORT: "50003",
    }
)

login_templeted.set(
    "C",
    {
        name: "C",
        password: "c",
        worldname: "CPE200",
        IP: "10.2.11.38",
        PORT: "50004",
    }
)

login_templeted.set(
    "D",
    {
        name: "D",
        password: "d",
        worldname: "CPE200",
        IP: "10.2.11.38",
        PORT: "50005",
    }
)

login_templeted.set(
    "E",
    {
        name: "E",
        password: "e",
        worldname: "CPE200",
        IP: "10.2.11.38",
        PORT: "50006",
    }
)

login_templeted.set(
    "F",
    {
        name: "F",
        password: "f",
        worldname: "CPE200",
        IP: "10.2.11.38",
        PORT: "50007",
    }
)


login_templeted.set(
    "G",
    {
        name: "G",
        password: "g",
        worldname: "CPE200",
        IP: "127.0.0.1",
        PORT: "50008",
    }
)



let sentSelected = async () => {
        let select_login = login_templeted.get(options.username)
    let port = options.port
        console.log(select_login)

    console.log("*************************************")
    console.log("*************************************")
    console.log("*************************************")
    console.log("*************************************")
    console.log("*************************************")
    console.log("*************************************")
    console.log("*************************************")
    console.log("*************************************")


    let args1 = {
            requestConfig: {timeout: 1000},
            response: {timeout: 2000},
            data: {
                name:select_login.name,
                password:select_login.password,
                IP: select_login.IP,
                PORT: select_login.PORT
            },
            headers: {
                "Content-Type": "application/json"
            }
        }
        console.log(JSON.stringify(args1.data, null, 4))
        await new Promise(resolve => {
            client.post("http://localhost:"+port+"/FORUI_LogInV2", args1, (data, response) => {
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
            worldname:select_login.worldname,
        },
        headers: {
            "Content-Type": "application/json"
        }
    }
    await new Promise(resolve => {
        setTimeout(
            ()=>{
                client.post("http://localhost:"+port+"/FORUI_SETWORLD_BYNAME", args2, (data, response) => {
                    console.log(chalk.green(JSON.stringify(data.toString())))
                    return resolve()
                }).on('error', (err) => {
                    console.log("Error " + err)
                    return resolve()
                })
            },1000
        )
    })

/*
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
    */
}
sentSelected()

