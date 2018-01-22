/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//////////////////////////Requirement Section////////////////////////
/////////////////////////////////////////////////////////////////////
///////**//This code require javascript version 6 or newer//**///////
////////////////////////miscellaneous////////////////////////////////

const chalk = require('chalk')
const HashArray = require('hasharray')

////////////////////////////From Configs/////////////////////////////

//const globalConfigs = require('../config/GlobalConfigs')
///////////////////////From Other Controllers////////////////////////

//const toolController = require(globalConfigs.mpath1.toolsController)
/////////////////////////////From Nodejs//////////////////////////////

const fs = require('fs')

const PORT = 44444;
const HOST = '127.0.0.1';

const dgram = require('dgram');
const Client = require('node-rest-client').Client
const commandLineArgs = require('command-line-args')

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////


//==================================================================================================
//==================================================================================================
//==================================================================================================

class Session {
    constructor () {

    }
}
class OneMemberClass {
    constructor(name, persistedID, positionX, positionY, standby, active) {
        this.name = name
        this.persistedID = persistedID
        this.positionX = positionX
        this.positionY = positionY
        this.standby = standby
        this.active = active
    }

    changePosition (newX, newY) {
        this.positionX = newX
        this.positionY = newY
        this.reRender()
    }
    changeStatus (status) {
        switch (status) {
            case "ST":
                this.standby = true
                break
            case "SF":
                this.standby = false
                break
            case "AT":
                this.standby = true
                break
            case "AF":
                this.standby = false
        }
    }

    reRender () {
        console.log("Dummy Method")
    }

}
class GlobalMemberClass {

    constructor () {
        this.Members = new Map()
    }

    getUpdate (res) {
        let resd = {
            members: [
                {name: "cheevarit", persistedID: "ege4g65egw", active: true, standby: true, positionX: 2, positionY:6, changedType: "All"},
                {name: "David", persistedID: "ege4g65egw", active: true, standby: true, positionX: 9, positionY:20, changedType: "All"},
                {name: "Sarah", persistedID: "ege4g65egw", active: true, standby: true, positionX: 12, positionY:17, changedType: "All"},
                {name: "Christina", persistedID: "ege4g65egw", active: true, standby: true, positionX: 19, positionY:30, changedType: "All"}
            ]
        }
        if (resd.members) {
            console.log("Found members change")
            for (let i of resd.members) {

                //console.log(i)
                let currentMember = this.Members.get(i.name)[1]
                if (currentMember) {
                    console.log("Found member in memory")
                    if (i.changedType) {
                        switch (i.changedType) {
                            case "All":
                                currentMember.persistedID = i.persistedID
                                currentMember.active = i.active
                                currentMember.standby = i.standby
                                currentMember.positionX = i.positionX
                                currentMember.positionY = i.positionY
                                break
                            case "ActiveStandby":
                                currentMember.active = i.active
                                currentMember.standby = i.standby
                                break
                            case "position":
                                currentMember.positionX = i.positionX
                                currentMember.positionY = i.positionY
                                break
                        }
                    }
                } else {
                    console.log("not found user in memory, now creating new")
                    let newUser = new OneMemberClass(i.name, i.persistedID, i.positionX, i.positionY, i.standby, i.active)
                    this.Members.set(i.name, newUser)
                }
            }
        }
    }

    sentUpdate () {

    }



    printMembers () {
        for (let i of this.Members) {
            console.log(i[1])
        }
    }
}
class ObjectClass {
    constructor() {
        this.persistedID = ""
        this.objectOwner = ""
        this.name = ""

        this.positionX = 0
        this.positionY = 0
    }
}

let GlobalMember = new GlobalMemberClass()
GlobalMember.getUpdate()
GlobalMember.printMembers()