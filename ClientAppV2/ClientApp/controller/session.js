/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//////////////////////////Requirement Section////////////////////////
/////////////////////////////////////////////////////////////////////
///////**//This code require javascript version 6 or newer//**///////
////////////////////////miscellaneous////////////////////////////////

const chalk = require('chalk')
const ndarray = require('ndarray')
const MatrixHash = require('matrix-hash')
////////////////////////////From Configs/////////////////////////////

///////////////////////From Other Controllers////////////////////////

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////


//==================================================================================================
//==================================================================================================
//==================================================================================================

class aciveMember_Class {
    constructor (name, persistedID, optionals) {
        this.name = name
        this.persistedID = persistedID
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
}
class objectLink_Class {
    constructor (persistedID, owner_name, optionals) {
        this.persistedID = persistedID
        this.owner_name = owner_name
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
}

class session_Class {
    constructor () {
        this.active_at_world_persistedID = ""
        this.active_at_object_persistedID = ""
        this.currentUser_positionX = 0
        this.currentUser_positionY = 0
        this.worldmatrix = new MatrixHash(2)
        this.activeMember = new Map()
        this.objectLink = new Map()
    }
    getMatrixInfo () {
        console.log("Matrix dimension : " + this.worldmatrix.dimension)
        console.log("Matrix size : " + this.worldmatrix.size)
    }
    printMatrix () {
        let message = ""
        for (let inrow = 0; inrow <= this.worldmatrix.shape[0];inrow++) {
            for (let incolume = 0; incolume <= this.worldmatrix.shape[1]; incolume++) {
                message += this.worldmatrix.get(inrow, incolume) + " "
            }
            message += "\n"
        }
        console.log(message)
    }


    setPosition_inMatrix (posX, posY, objectReference) {
        this.worldmatrix.set([posX, posY], objectReference)
    }
    removePosition_inMatrix (posX, posY) {
        this.worldmatrix.set([posX, posY, null])
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






    callActiveMember (name, persistedID, others) {
        let currentMember = this.activeMember.get("name")
        if (!others) {
            return null
        }
        if (!currentMember) {
            console.log("no member found in memory")
            currentMember = new aciveMember_Class(name, persistedID, {positionX: others.x, positionY: others.y})
            this.activeMember.set(name, currentMember)

        } else {
            console.log("member already in memory")
        }
        return currentMember
    }
    callObjectLink (persistedID, owner_name, others) {
        let currentObject = this.objectLink.get(persistedID)
        if (!others) {
            return null
        }
        if (!currentObject) {
            console.log("no object found in memory")
            currentObject = new objectLink_Class(persistedID, owner_name, {positionX: others.x, positionY: others.y})
            this.objectLink.set(persistedID, currentObject)
        } else {
            console.log("object already in memory")
        }
        return currentObject
    }

    refresh (lists) {
        this.activeMember = null
        this.objectLink = null
        for (let i of lists) {
            switch (i.type) {
                case "member":
                    this.callActiveMember(i.name, i.persistedID, {positionX:i.positionX, positionY:i.positionY})
                    break
                case "object":
                    this.callObjectLink(i.persistedID, i.owner_name, {positionX:i.positionX, positionY: i.positionY})
                    break
            }
        }
    }

    getMessage (message) {

    }
    sentMessage (ip, port, message) {

    }
}

module.exports.session_Class = session_Class