/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//////////////////////////Requirement Section////////////////////////
/////////////////////////////////////////////////////////////////////
///////**//This code require javascript version 6 or newer//**///////
////////////////////////miscellaneous////////////////////////////////

const chalk = require('chalk')
const ndarray = require('ndarray')
//const MatrixHash = require('matrix-hash') BUG
////////////////////////////From Configs/////////////////////////////

const globalConfigs = require('../config/GlobalConfigs')
///////////////////////From Other Controllers////////////////////////

const toolsController = require(globalConfigs.mpath1.toolsController)
const messagesController = require(globalConfigs.mpath1.messagesController)
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////


//==================================================================================================
//==================================================================================================
//==================================================================================================

class aciveMember_Class {
    constructor (name, persistedID, optionals) {
        this.maintype = "member"
        this.name = name
        this.persistedID = persistedID
        this.positionX = 0
        this.positionY = 0
        this.IP = ""
        this.PORT = ""
        this.standby = false
        //console.log("show constructor optionals " + JSON.stringify(optionals, null, 4))
        if (optionals) {
            if (optionals.positionX) {
                this.positionX = optionals.positionX
            }
            if (optionals.positionY) {
                this.positionY = optionals.positionY
            }
            if (optionals.IP) {
                this.IP = optionals.IP
            }
            if (optionals.PORT) {
                this.PORT = optionals.PORT
            }
        }
    }
    changePosition (newX, newY) {
        this.positionX = newX
        this.positionY = newY
    }
    changeIPPORT (newIP, newPORT) {
        this.IP = newIP
        this.PORT = newPORT
    }
    changeStandbyMode (TF) {
        if (TF === true || TF === false) {
            this.standby = TF
        } else {
            console.log("TF Error")
        }
    }
}
class objectLink_Class {
    constructor (persistedID, owner_name, type, optionals) {
        this.maintype = "object"
        this.persistedID = persistedID
        this.owner_name = owner_name
        this.type = ""
        this.positionX = 0
        this.positionY = 0
        if (optionals) {
            if (optionals.positionX) {
                this.positionX = optionals.positionX
            }
            if (optionals.positionY) {
                this.positionY = optionals.positionY
            }
        }
    }
    changePosition (newX, newY) {
        this.positionX = newX
        this.positionY = newY
    }
    changeType (newType) {
        this.type = newType
    }
}




class sessionObjectMemory_Class {
    constructor () {
        this.objectPointer = new Map()
    }
    ADD_newObjectMemory (id_or_name,ObjectMemory_Pointer) {
        if (this.objectPointer.has(id_or_name)) {
            console.log("this id or name already allocate memory")
        } else {
            this.objectPointer.set(id_or_name, ObjectMemory_Pointer)
            console.log("create new in memory completed")
        }
    }
    REMOVE_ObjectMemory (id_or_name) {
        if (this.objectPointer.delete(id_or_name)) {
            console.log("delete completed")
        } else {
            console.log("object memory not found")
        }
    }
    GET_ObjectMemoryReference (id_or_name) {
        return this.objectPointer.get(id_or_name)
    }
}

class session_Class {
    constructor () {
        this.active_at_world_persistedID = ""
        this.active_at_object_persistedID = ""
        //this.active_at_object_objectowner = ""
        //this.active_at_object_type = ""
        this.object_owner_name = ""

        this.currentUser_persistedID = globalConfigs.ClientInfo.currentUser_persistedID
        this.currentUser_name = globalConfigs.ClientInfo.currentUser_name
        this.currentUser_password = "abcd"
        this.currentUser_IP = globalConfigs.ClientInfo.clientIP
        this.currentUser_PORT = globalConfigs.ClientInfo.clientPORT

        //this.worldmatrix = new MatrixHash(2)
        this.worldmatrix = new toolsController.HashMatrix()

        this.activeMember = new Map()
        this.objectLink = new Map()

        this.heartbeatScheduler = null
        this.heartbeatIntervalTime = 5000 //ms

        this.currentMessageTransactionGet = 0
        this.currentMessageTransactionSent = 0

        this.worldsizeX = 40
        this.worldsizeY = 15

        this.ALLTASK = []
        this.HEARTBEAT_signal_start()
    }

    HEARTBEAT_signal_start () {
        if (this.heartbeatScheduler) {
            console.log("Heartbeat signal already started")
        } else {
            console.log("Starting heartbeat")
            this.heartbeatScheduler = setInterval(
                () => {
                    messagesController.messagesGlobalMethods.httpOutput_POST_SERVER(globalConfigs.specificServerPath.user_messages_serverpath,messagesController.messagesTemplates.signalHeartBeat(this.currentUser_name, this.active_at_world_persistedID, this.active_at_object_persistedID, this.currentUser_IP, this.currentUser_PORT))
                    console.log("Sent heartbeat")
                }
                , this.heartbeatIntervalTime
            )
        }
    }
    HEARTBEAT_signal_stop () {
        if (this.heartbeatScheduler) {
            clearInterval(this.heartbeatScheduler)
            this.heartbeatScheduler = null
        }
    }

    SET_CurrentUSER (name, persistedID, password) {
        this.currentUser_name = name
        this.currentUser_persistedID = persistedID
        this.currentUser_password = password
    }
    SET_CurrentWorld (persistedID) {
        this.active_at_world_persistedID = persistedID
        console.log(chalk.cyanBright("SET CURRENT WORLD TO ID : " +  persistedID))
    }
    SET_CurrentObjectLink (persistedID) {
        this.active_at_object_persistedID = persistedID
        console.log(chalk.cyanBright("SET CURRENT OBJECT TO ID : " +  persistedID))

        //this.active_at_object_objectowner = ownername
        //this.active_at_object_type = type
    }
    SET_IP_PORT (ip, port) {
        this.currentUser_IP = ip
        this.currentUser_PORT = port
    }


    getMatrixInfo () {
        this.worldmatrix.getInfo()
    }
    printMatrix (row, colume) {
        let message = ""
        for (let incolume = 0; incolume <= colume;incolume++) {
            for (let inrow = 0; inrow <= row; inrow++) {
                //console.log("incolume : " + incolume + "  inrow : " + inrow)
                let data = this.getData_inMatrix(inrow, incolume)
                if (data){
                    message += data + " "
                } else {
                    message += "* "
                }
            }
            message += "\n"
        }
        console.log(message)
    }


    setPosition_inMatrix (posX, posY, objectReference) {
        //console.log("show object reference " + objectReference)
        this.worldmatrix.set(posX, posY, objectReference)
        //console.log("show element " + this.worldmatrix.get([posX, posY]))
    }
    getData_inMatrix (posX, posY) {
        return this.worldmatrix.get(posX, posY)
    }
    removePosition_inMatrix (posX, posY) {
        //console.log("remove position occured at posX " + posX + " posY " + posY)
        //console.log("before remove : " + JSON.stringify(this.getData_inMatrix(posX, posY), null, 4))
        this.worldmatrix.set(posX, posY, null)
        //console.log("after remove : " + JSON.stringify(this.getData_inMatrix(posX, posY), null, 4))

    }



    ACTION_changeObjectPosition (objectReference,newX, newY) {
        if (this.getData_inMatrix(newX, newY)) {
            console.log("destination position has already allocated")
            return false
        }
        let oldX = objectReference.positionX
        let oldY = objectReference.positionY
        this.removePosition_inMatrix(oldX, oldY)
        objectReference.positionX = newX
        objectReference.positionY = newY
        this.setPosition_inMatrix(newX, newY, objectReference)
        return true
    }
    ACTION_removeObjectLink (persistedID) {
        console.log("Action remove object")
        let currentObjectLink = this.objectLink.get(persistedID)
        if (currentObjectLink) {
            let objectpositionX = currentObjectLink.positionX
            let objectpositionY = currentObjectLink.positionY
            this.removePosition_inMatrix(objectpositionX, objectpositionY)
            this.objectLink.delete(persistedID)
        } else {

        }
    }
    ACTION_removeActiveMember (member_name) {
        let currentActiveMember = this.activeMember.get(member_name)
        if (currentActiveMember) {
            let activeMemberpositionX = currentActiveMember.positionX
            let activeMemberpositionY = currentActiveMember.positionY
            this.removePosition_inMatrix(activeMemberpositionX, activeMemberpositionY)
            this.activeMember.delete(member_name)
        } else {

        }
    }
    ACTION_refresh () {
        this.activeMember = new Map()
        this.objectLink = new Map()
        this.worldmatrix = new toolsController.HashMatrix()
    }



    CONTROL_MoveToPosition (posX, posY) {
        let ownuser = this.getOwnMember()
        if (ownuser) {
            if (this.ACTION_changeObjectPosition(ownuser, posX, posY)) {
                messagesController.messagesGlobalMethods.httpOutput_POST_SERVER(globalConfigs.specificServerPath.user_messages_serverpath, messagesController.messagesTemplates.moveUserPosition(ownuser,posX, posY, this.active_at_world_persistedID))
            } else {
                console.log("move error")
            }
        } else {
            console.log("your user not found in memory or database")
        }
    }
    CONTROL_ChangeActiveWorld (newActiveWorld_persistedID) {
        this.active_at_world_persistedID = newActiveWorld_persistedID
        messagesController.messagesGlobalMethods.httpOutput_POST_SERVER(globalConfigs.specificServerPath.user_messages_serverpath, messagesController.messagesTemplates.changeActiveWorld(newActiveWorld_persistedID, this.currentUser_name))
    }
    CONTROL_ChangeActiveObject (newObject_persistedID) {
        this.active_at_object_persistedID = newObject_persistedID
        messagesController.messagesGlobalMethods.httpOutput_POST_SERVER(globalConfigs.specificServerPath.user_messages_serverpath, messagesController.messagesTemplates.changeActiveObject(newObject_persistedID, this.currentUser_name))
    }

    FORUI_getallactivemember() {
        let lists = []
        for (let i of this.activeMember) {
            lists.push(i)
        }
        return lists
    }
    FORUI_getallobjectlinks () {
        let lists = []
        for (let i of this.objectLink) {
            lists.push(i)
        }
        return lists
    }
    FORUI_getinfo_fromPosition (posX, posY) {
        return this.getData_inMatrix(posX, posY)
    }

    getOwnMember () {
        console.log("getting : " + this.currentUser_name)
        return this.activeMember.get(this.currentUser_name)
    }


    PRINT_activeMembers () {
        let messages = ""
        for (let i of this.activeMember) {
            messages += i[1].name + " "
        }
        console.log("ACTIVE MEMBER")
        console.log(messages)
    }
    PRINT_objectLink () {
        let messages = ""
        for (let i of this.objectLink) {
            messages += i[1].persistedID + " "
        }
        console.log("ACTIVE Object Links")
        console.log(messages)
    }
    PRINT_info () {
        console.log("****Print Session Info****")
        console.log("Active at world ID : " + this.active_at_object_persistedID)
        console.log("Active at object ID : " + this.active_at_object_persistedID + " owner name : " + this.object_owner_name)

        console.log("User information || ID : " + this.currentUser_persistedID + " name : " + this.currentUser_name + " password " + this.currentUser_password)
        console.log("                 || PORT : " + this.currentUser_IP + " PORT : " + this.currentUser_PORT)

        //this.PRINT_activeMembers()
        //this.PRINT_objectLink()
    }




    MONITOR_Session () {
        let messages = "**********************Session Monitoring************************\n"
        messages += "Active at world ID : " + this.active_at_object_persistedID + "\n"
        messages += "Active at object ID : " + this.active_at_object_persistedID + " owner name : " + this.object_owner_name + "\n"
        messages += "User information || ID : " + this.currentUser_persistedID + " name : " + this.currentUser_name + " password " + this.currentUser_password + "\n"

        messages += "Active Member : \n"
        for (let i of this.activeMember) {
            let j = i[1]
            messages += `{ name :${j.name} posX :${j.positionX} posY:${j.positionY} standby:${j.standby} IP:${j.IP} PORT:${j.PORT} } `
        }
        messages += "\n"
        messages += "Active Object Link : \n"

        for (let i of this.objectLink) {
            let j = i[1]
            messages += `{ persistedID :${j.persistedID} owner_name :${j.owner_name} posX :${j.positionX} posY:${j.positionY} } `
        }
        messages += "\n"

        messages += "-------------------------------------------------------------------\n"

        for (let inY = 0; inY <= this.worldsizeY; inY++) {
            for (let inX = 0; inX <= this.worldsizeX; inX++) {
                //console.log("inX : " + inX + "  inY : " + inY)
                let data = this.getData_inMatrix(inX, inY)
                if (data){
                    /*
                    console.log("data" + JSON.stringify(data, null, 4))
                    messages += "U "*/

                    if (data.maintype === "member"){
                        messages += "U "
                    } else if (data.maintype === "object") {
                        messages += "O "
                    }

                } else {
                    messages += "* "
                }
            }
            messages += "\n"
        }

        messages += "-------------------------------------------------------------------"
        return messages
    }

    callActiveMember (name, persistedID, others) {
        let currentMember = this.activeMember.get(name)
        if (!others) {
            return null
        }
        if (!currentMember) {
            console.log("no member found in memory")
            currentMember = new aciveMember_Class(name, persistedID, {positionX: others.positionX, positionY: others.positionY, IP:others.IP, PORT: others.PORT})
            this.activeMember.set(name, currentMember)
            this.setPosition_inMatrix(others.positionX, others.positionY, currentMember)
        } else {
            console.log("member already in memory")
            if (currentMember.positionX === others.positionX && currentMember.positionY === others.positionY) {
                console.log("position not changed")
            } else {
                console.log("position changed")
                this.ACTION_changeObjectPosition(currentMember, others.positionX, others.positionY)
            }
            if (currentMember.IP === others.IP && currentMember.PORT === others.PORT) {
                //console.log(`others IP: ${others.IP} PORT: ${others.PORT}`)
                console.log("IP and PORT not changed")
            } else {
                console.log("IP and PORT changed")
                currentMember.changeIPPORT(others.IP, others.PORT)
            }
        }
        return currentMember
    }
    callObjectLink (persistedID, owner_name, type, others) {
        let currentObject = this.objectLink.get(persistedID)
        if (!others) {
            return null
        }
        if (!currentObject) {
            console.log("no object found in memory")
            currentObject = new objectLink_Class(persistedID, owner_name, type, {positionX: others.positionX, positionY: others.positionY})
            this.objectLink.set(persistedID, currentObject)
            this.setPosition_inMatrix(others.positionX, others.positionY, currentObject)
        } else {
            console.log("object already in memory")
            if (currentObject.positionX === others.positionX && currentObject.positionY === others.positionY) {
                console.log("position not changed")
            } else {
                console.log("position changed")
                this.ACTION_changeObjectPosition(currentObject, others.positionX, others.positionY)
            }


        }
        return currentObject
    }


    getMessage (message) {

    }
    sentMessage (ip, port, message) {

    }
}
const globalSession = new session_Class()
//////This code is for tester //////////////

globalSession.SET_CurrentUSER("Nutmos", "5a5b4fe146f399051f99b4c1", "1234")
globalSession.SET_CurrentWorld("5a5b50a146f399051f99b4c4")

/*
globalSession.callActiveMember("chee","aaaa",{positionX: 2, positionY:2, IP: "122.15.26.5", PORT: 50000})
globalSession.callActiveMember("david","bbbb",{positionX: 3, positionY:3, IP: "122.15.26.6", PORT: 50000})
globalSession.callActiveMember("christin","cccc",{positionX: 4, positionY:4, IP: "122.15.26.7", PORT: 50000})
globalSession.callActiveMember("sarah","dddd",{positionX: 5, positionY:5, IP: "122.15.26.8", PORT: 50000})
globalSession.callActiveMember("james","eeee",{positionX: 6, positionY:6, IP: "122.15.26.9", PORT: 50000})

globalSession.callObjectLink("00000","chee","remote",{positionX: 10,positionY: 10})
globalSession.callObjectLink("00001","chee","remote",{positionX: 12,positionY: 10})
globalSession.callObjectLink("00002","david","remote",{positionX: 14,positionY: 10})
*/

////////////////////////////////////////////

module.exports.session_Class = session_Class
module.exports.globalSession = globalSession