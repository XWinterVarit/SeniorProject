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

const globalConfigs = require('../config/GlobalConfigs')
///////////////////////From Other Controllers////////////////////////

const sessionController = require(globalConfigs.mpath1.sessionController)
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
            {type: "object", subtype: "remote",persistedID: "11",owner_name: "david", positionX: 24, positionY: 24},
            {type: "object", subtype: "dummy",persistedID: "12",owner_name: "david", positionX: 25, positionY: 25},
        ]
    }
}

class messagesGlobalMethods {
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
        }
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
                    sessionController.globalSession.ACTION_removeActiveMember(i.persistedID)
                    break
            }
        }
        console.log("end remove")
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