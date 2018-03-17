/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//////////////////////////Requirement Section////////////////////////
/////////////////////////////////////////////////////////////////////
///////**//This code require javascript version 6 or newer//**///////
////////////////////////miscellaneous////////////////////////////////

const chalk = require('chalk')
const ndarray = require('ndarray')
const MatrixHash = require('matrix-hash')
const AsyncLock = require('async-lock')
const Client = require('node-rest-client').Client
let client = new Client()
const dgram = require('dgram');
////////////////////////////From Configs/////////////////////////////

const globalConfigs = require('../config/GlobalConfigs')
///////////////////////From Other Controllers////////////////////////

const sessionController = require(globalConfigs.mpath1.sessionController)
const toolsController = require(globalConfigs.mpath1.toolsController)
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

//==================================================================================================
//==================================================================================================
//==================================================================================================

let incomingMessageTest = {
    body: {
        type: "refresh",
        lists: [
            {type: "member", name: "well", persistedID: "1", positionX: 20, positionY: 20, standby: false, active: true, IP : "127.0.0.1", PORT : "50000"},
            {type: "member", name: "A", persistedID: "2", positionX: 21, positionY: 21, standby: false, active: true, IP : "127.0.0.1", PORT : "50000"},
            {type: "member", name: "B", persistedID: "3", positionX: 22, positionY: 22, standby: false, active: true, IP : "127.0.0.1", PORT : "50000"},
            {type: "object", subtype: "remote", persistedID: "10",owner_name: "cheevarit", positionX: 23, positionY: 23},
            {type: "object", subtype: "remote", persistedID: "11",owner_name: "david", positionX: 24, positionY: 24},
            {type: "object", subtype: "dummy", persistedID: "12",owner_name: "david", positionX: 25, positionY: 25},
        ]
    }
}
class http_in_queue {
    constructor() {
        this.queue = []
        this.worksSize = 0
        this.LOCK_queue = new AsyncLock()
        this.frozen = false
    }
    ADD_queue (req) {
        this.LOCK_queue.acquire('key', () => {
            this.queue.push(req)
            if (this.worksSize === 0) {
                this.worksSize++
                this.DO_queue()
            } else {
                this.worksSize++
            }
        }).catch(error=>{
            console.log("Lock error : " + error)
        })
    }
    async REDUCE_queue () {
        await this.LOCK_queue.acquire('key', ()=>{
            this.worksSize--
        }).catch(error=>{
            console.log("Lock error : " + error)
        })
    }
    async DO_queue () {
        if (this.frozen) {
            return
        }
        let onequeue
        await this.LOCK_queue.acquire('key', ()=>{
            onequeue = this.queue.shift()
        })
        if (onequeue) {
            console.log("start queue")
            messagesGlobalMethods.httpInput(onequeue)
            await this.REDUCE_queue()
            this.DO_queue()
        } else {
            console.log("queue is now empty")
        }
    }
    PRINT_allqueue () {
        for (let i of this.queue) {
            console.log("show queue")
            console.log(JSON.stringify(i, null, 4))
        }
    }
    DEBUG_frozenqueue () {
        this.frozen = true
    }
    DEBUG_continuequeue () {
        this.frozen = false
        this.DO_queue()
    }
}
class udp_out_queue {
    constructor() {
        this.queue = []
        this.worksSize = 0
        this.LOCK_queue = new AsyncLock()
        this.frozen = false
    }
    ADD_queue (req) {
        this.LOCK_queue.acquire('key', () => {
            this.queue.push(req)
            if (this.worksSize === 0) {
                this.worksSize++
                this.DO_queue()
            } else {
                this.worksSize++
            }
        }).catch(error=>{
            console.log("Lock error : " + error)
        })
    }
    async REDUCE_queue () {
        await this.LOCK_queue.acquire('key', ()=>{
            this.worksSize--
        }).catch(error=>{
            console.log("Lock error : " + error)
        })
    }
    async DO_queue () {
        if (this.frozen) {
            return
        }
        let onequeue
        await this.LOCK_queue.acquire('key', ()=>{
            onequeue = this.queue.shift()
        })
        if (onequeue) {
            console.log("start queue")
            await messagesGlobalMethods.udpOutput(onequeue)
            await this.REDUCE_queue()
            this.DO_queue()
        } else {
            console.log("queue is now empty")
        }
    }
    PRINT_allqueue () {
        for (let i of this.queue) {
            console.log("show queue")
            console.log(JSON.stringify(i, null, 4))
        }
    }
    DEBUG_frozenqueue () {
        this.frozen = true
    }
    DEBUG_continuequeue () {
        this.frozen = false
        this.DO_queue()
    }
}


let requestQueue = new http_in_queue()
let udpoutQueue = new udp_out_queue()
class messagesTemplates {
    static moveUserPosition (userRef, posX, posY, activeWorld_persistedID) {
        return {
            name: userRef.name,
            type: "toone",
            activeworld: activeWorld_persistedID,
            WO_type: "mov",
            WO_name: userRef.name,
            WO_positionX: posX,
            WO_positionY: posY
        }
    }
    static changeActiveWorld (world_persistedID, username) {
        return {
            name: username,
            type: "toone",
            activeworld: world_persistedID,
        }
    }
    static changeActiveObject (object_persistedID, username) {
        return {
            name: username,
            type: "toone",
            activeobject: object_persistedID,
        }
    }
    static signalHeartBeat (username, activeWorld_persistedID, activeObject_persistedID, IP, PORT) {
        return {
            name: username,
            type: "toone",
            activeworld: activeWorld_persistedID,
            activeobject: activeObject_persistedID,
            ipaddr: IP,
            port: PORT
        }
    }
}

class messagesGlobalMethods {
    static httpInputQueue (req) {
        requestQueue.ADD_queue(req)
        //requestQueue.DEBUG_frozenqueue()
        //requestQueue.PRINT_allqueue()
    }
    static httpInput (req) {
        switch (req.body.type) {
            case "update":
                this.updateSession(req.body.lists)
                break
            case "refresh":
                this.refreshSession(req.body.lists)
                break
            case "remove":
                this.removeInSession(req.body.lists)
                break
            case "p2ptask":
                break
        }
    }

    static httpOutput_POST_SERVER (path, data) {
        let args = {
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }
  /*
        console.log(chalk.green("Show args"))
        console.log(chalk.green(JSON.stringify(args, null, 4)))
*/
        client.post("http://" + globalConfigs.ServerInfo.serverIP + ":" + globalConfigs.ServerInfo.serverPort +"/" + path, args, (datareturn, response) => {
            return datareturn
        }).on('error', (err) => {
            console.log("Error " + err)
            return null
        })
    }

    static httpOutput_POST_ANY (IP, PORT, path, data) {
        let args = {
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }
        console.log(chalk.green("Show args"))
        console.log(chalk.green(JSON.stringify(args, null, 4)))

        client.post("http://" + IP + ":" + PORT +"/" + path, args, (datareturn, response) => {
            return datareturn
        }).on('error', (err) => {
            console.log("Error " + err)
            return null
        })
    }

    static httpOutput_GET_SERVER (path) {
        client.get("http://" + globalConfigs.ServerInfo.serverIP + ":" + globalConfigs.ServerInfo.serverPort +"/" + path, (datareturn, response) => {
            return datareturn
        }).on('error', (err) => {
            console.log("Error " + err)
            return null
        })
    }
    static udpOutputQueue (IP, PORT, data) {
        udpoutQueue.ADD_queue([IP,PORT,data])
    }
    static async udpOutput (onequeue) {
        let client = dgram.createSocket('udp4');

        client.bind({
            address: 'localhost',
            port: 50005,
            exclusive: true
        })

        await new Promise(resolve => {
            client.send(onequeue[2], 0, onequeue[2].length, onequeue[1], onequeue[0], function (err, bytes) {
                if (err) throw err;
                console.log('UDP message sent to ' + HOST + ':' + PORT);
                resolve()
            })
        })
        client.close();
    }


    static updateSession (lists) {
        console.log("start update")
        for (let i of lists) {
            switch (i.type) {
                case "member":
                    sessionController.globalSession.callActiveMember(i.name, i.persistedID, {positionX: i.positionX, positionY: i.positionY, standby: i.standby, IP: i.IP, PORT: i.PORT})
                    break
                case "object":
                    //console.log("IGNORE object")
                    sessionController.globalSession.callObjectLink(i.persistedID, i.owner_name, i.subtype, {positionX: i.positionX, positionY: i.positionY})
                    break
            }
        }
        console.log("end update")
    }
    static refreshSession (lists) {
        console.log("start refresh")
        sessionController.globalSession.ACTION_refresh()
        for (let i of lists) {
            switch (i.type) {
                case "member":
                    sessionController.globalSession.callActiveMember(i.name, i.persistedID, {positionX: i.positionX, positionY: i.positionY, standby: i.standby, IP: i.IP, PORT: i.PORT})
                    break
                case "object":
                    //console.log("IGNORE object")
                    sessionController.globalSession.callObjectLink(i.persistedID, i.owner_name, i.subtype, {positionX: i.positionX, positionY: i.positionY})
                    break
            }
        }
        console.log("end refresh")
    }
    static removeInSession (lists) {
        console.log("start remove")
        for (let i of lists) {
            switch (i.type) {
                case "member":
                    sessionController.globalSession.ACTION_removeActiveMember(i.name)
                    break
                case "object":
                    sessionController.globalSession.ACTION_removeObjectLink(i.persistedID)
                    break
            }
        }
        console.log("end remove")
    }


    static udpInput (allbuffer) {
        let arraydatas = toolsController.BufferUtility.extractbuffer(allbuffer)
        if (!arraydatas) {
            console.log("udp extracted error")
            return false
        }
        let route = arraydatas[0].toString()
        console.log(chalk.green("found route : " + route))
        toolsController.BufferUtility.printArrayofBuffer(arraydatas)
        switch (route) {
            case "REMF":
                console.log("go to Remote frame route")
                //this.udpRemoteFrame(arraydatas)
                break
            default:
                console.log("message route not found")
                break
        }
    }

    //////Remote Section
    static updateTask () {

    }
    static udpRemoteFrame (arraydatas) {
        /*
        *  arrayindex
        *  0 route
        *  1 objectID
        *  2 ownerID
        *  3 ownerName
        *  4 framenumber
        *  5 timestamp
        *  6 framebuffer
        *
        * */
        sessionController.globalSession.ACTION_REMOTEDESKTOP_updateframe(arraydatas[1], arraydatas[2], arraydatas[3], arraydatas[4], arraydatas[6], arraydatas[5])
    }


    static test (){
        let str = JSON.stringify(incomingMessageTest)
        //console.log(str)
        let obj = JSON.parse(str)
        console.log()
        console.log("show type : " + obj.body.type)
        console.log("show list ")
        for (let i of obj.body.lists) {
            //console.log(i)
            switch (i.type) {
                case "member":
                    sessionController.globalSession.callActiveMember(i.name, i.persistedID, {positionX: i.positionX, positionY: i.positionY, standby: i.standby, IP: i.IP, PORT: i.PORT})
                    break
                case "object":
                    //console.log("IGNORE object")
                    sessionController.globalSession.callObjectLink(i.persistedID, i.owner_name, i.subtype, {positionX: i.positionX, positionY: i.positionY})
                    break
            }
        }
    }
}

module.exports.messagesGlobalMethods = messagesGlobalMethods
module.exports.requestQueue = requestQueue
module.exports.messagesTemplates = messagesTemplates