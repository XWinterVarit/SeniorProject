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

let incomingMessageTest = {
    body: {
        type: "refresh",
        lists: [
            {type: "member", name: "well", persistedID: "1", positionX: 20, positionY: 20, standby: false, active: true},
            {type: "member", name: "A", persistedID: "2", positionX: 21, positionY: 21, standby: false, active: true},
            {type: "member", name: "B", persistedID: "3", positionX: 22, positionY: 22, standby: false, active: true},
            {type: "object", subtype: "remote", persistedID: "10",owner_name: "cheevarit", positionX: 23, positionY: 23, standby: false, active: true},
            {type: "object", subtype: "remote",persistedID: "11",owner_name: "david", positionX: 24, positionY: 24, standby: false, active: true},
            {type: "object", subtype: "dummy",persistedID: "12",owner_name: "david", positionX: 25, positionY: 25, standby: false, active: true},
        ]
    }
}

class messagesGlobalMethods {
    static httpInput (req) {
        switch (req.body.type) {
            case "update":
                break
            case "refresh":
                break
        }
    }
    static test (){
        let str = JSON.stringify(incomingMessageTest)
        console.log(str)
        let obj = JSON.parse(str)
        console.log()
        console.log("show type : " + obj.body.type)
        console.log("show list ")
        for (let i of obj.body.lists) {
            console.log(i)
        }
    }
}

module.exports.messagesGlobalMethods = messagesGlobalMethods