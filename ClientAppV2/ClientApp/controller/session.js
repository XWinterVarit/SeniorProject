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

class session_Class {
    constructor () {
        this.active_at_world_persistedID = ""
        this.active_at_object_persistedID = ""
        this.object_owner_name = ""

        this.currentUser_persistedID = ""
        this.currentUser_name = ""
        this.currentUser_password = ""

        //this.worldmatrix = new MatrixHash(2)
        this.worldmatrix = new toolsController.HashMatrix()

        this.activeMember = new Map()
        this.objectLink = new Map()

        this.currentMessageTransactionGet = 0
        this.currentMessageTransactionSent = 0

        this.worldsizeX = 15
        this.worldsizeY = 40
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
        console.log("show object reference " + objectReference)
        this.worldmatrix.set(posX, posY, objectReference)
        console.log("show element " + this.worldmatrix.get([posX, posY]))
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
        let oldX = objectReference.positionX
        let oldY = objectReference.positionY
        this.removePosition_inMatrix(oldX, oldY)
        objectReference.positionX = newX
        objectReference.positionY = newY
        this.setPosition_inMatrix(newX, newY, objectReference)
    }
    ACTION_removeObjectLink (persistedID) {
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
        this.activeMember = null
        this.objectLink = null
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

        this.PRINT_activeMembers()
        this.PRINT_objectLink()
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

        for (let inY = 0; inY <= this.worldsizeX; inY++) {
            for (let inX = 0; inX <= this.worldsizeY; inX++) {
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
module.exports.session_Class = session_Class
module.exports.globalSession = globalSession