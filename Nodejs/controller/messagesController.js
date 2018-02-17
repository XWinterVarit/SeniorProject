/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//////////////////////////Requirement Section////////////////////////
/////////////////////////////////////////////////////////////////////
///////**//This code require javascript version 6 or newer//**///////
////////////////////////miscellaneous////////////////////////////////

const chalk = require('chalk')
const ndarray = require('ndarray')
const AsyncLock = require('async-lock')
const Client = require('node-rest-client').Client
let client = new Client()
////////////////////////////From Configs/////////////////////////////

const globalConfigs = require('../config/GlobalConfigs')
///////////////////////From Other Controllers////////////////////////

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

//==================================================================================================
//==================================================================================================
//==================================================================================================

const ClientPathTempleted = {
    clientUserGateway: "clientUserGateway"
}

class messagesTemplates {
    static BROADCAST_moveUserPosition (name, persistedID, standby, IP, PORT, posX, posY) {
        return {
            type: "update",
            lists: [
                {
                    type: "member",
                    name: name,
                    persistedID: persistedID,
                    positionX: posX,
                    positionY: posY,
                    standby: standby,
                    active: true,
                    IP: IP,
                    PORT: PORT
                }
            ]
        }
    }
    static BROADCAST_moveObjectPosition (subtype, persistedID, owner_name, posX, posY) {
        return {
            type: "update",
            lists: [
                {
                    type: "object",
                    subtype: subtype,
                    persistedID: persistedID,
                    owner_name: owner_name,
                    positionX: posX,
                    positionY: posY
                }
            ]
        }
    }
    static BROADCAST_REFRESH_all (refreshlist) {
        return {
            type: "refresh",
            lists: refreshlist
        }
    }
    static CRAFT_one_user (name, persistedID, standby, IP, PORT, posX, posY) {
        return {
            type: "member",
            name: name,
            persistedID: persistedID,
            positionX: posX,
            positionY: posY,
            standby: standby,
            active: true,
            IP: IP,
            PORT: PORT
        }
    }
    static CRAFT_one_object (subtype, persistedID, owner_name, posX, posY) {
        return {
            type: "object",
            subtype: subtype,
            persistedID: persistedID,
            owner_name: owner_name,
            positionX: posX,
            positionY: posY
        }
    }


    static BROADCAST_UserOut (name) {
        return {
            type: "remove",
            name: name,
        }
    }
    static BROADCAST_ObjectOut (persistedID) {
        return {
            type: "remove",
            name: persistedID
        }
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

class messagesGlobalMethods {
    static httpInputQueue (req) {
        requestQueue.ADD_queue(req)
        //requestQueue.DEBUG_frozenqueue()
        //requestQueue.PRINT_allqueue()
    }
    static httpInput (req) {
        // not implement yet, now it all redirect to userController first.
        /*
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
        }
        */
    }
    static httpOutput_BROADCAST_POST (addressLists,path, data) {
        let args = {
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }
        for (let i of addressLists) {
            console.log(`sent to IP : ${i[0]} PORT : ${i[1]}`)
            client.post("http://" + i[0] + ":" + i[1] +"/" + path, args, (datareturn, response) => {
                console.log(chalk.red(datareturn))
            })
        }

    }
    static httpOutput_POST (IP, PORT, path, data) {
        let args = {
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }
        client.post("http://" + IP + ":" + PORT +"/" + path, args, (datareturn, response) => {
            return datareturn
        })
    }
    static httpOutput_GET_SERVER (IP, PORT, path) {
        client.get("http://" + IP + ":" + PORT +"/" + path, (datareturn, response) => {
            return datareturn
        })
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

module.exports.messagesTemplates = messagesTemplates
module.exports.ClientPathTemplated = ClientPathTempleted
module.exports.messagesGlobalMethods = messagesGlobalMethods