/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//////////////////////////Requirement Section////////////////////////
/////////////////////////////////////////////////////////////////////
///////**//This code require javascript version 6 or newer//**///////
////////////////////////miscellaneous////////////////////////////////

const chalk = require('chalk')
const HashArray = require('hasharray')
////////////////////////////From Configs/////////////////////////////

const globalConfigs = require('../config/GlobalConfigs')
///////////////////////From Other Controllers////////////////////////

const toolController = require(globalConfigs.mpath1.toolsController)
/////////////////////////////From Mongo//////////////////////////////

const mongotools = require(globalConfigs.mpath1.mongodb).tools
let ObjectID = require('mongodb').ObjectID
const safeObjectId = s => ObjectID.isValid(s) ? new ObjectID(s) : null
/////////////////////////////from redis//////////////////////////////

const redistools = require(globalConfigs.mpath1.redis).tools
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////


//==================================================================================================
//==================================================================================================
//==================================================================================================
class One_Scheduler_RemoteDesktopP2P {
    constructor (persisted_id) {

        this.persisted_id = persisted_id

        this.setofDeliver = []
        this.setofFulledDeliver = []
        this.setofReceiver = []
        this.tmpDeliver = []

        this.changed = false
        this.maximumDelivingPerNode = 5
        this.activeMembers = new Map()
        this.Debug_activeMembers = []
        this.read_lock = false

        this.calculateSchedule = null
        this.active = true
        this.calculateIntervalTime = 2000 // millisec
    }
    removeActiveMember (username) {
        const globalmemoryController = require(globalConfigs.mpath1.globalmemoryController)
        let currentMember = this.activeMembers.get(username)

        if (currentMember) {
            this.activeMembers.delete(username)
            this.changed = true
        } else {
            console.log("already not in this")
        }
    }
    forceChangeActiveMember () {
        this.changed = true
    }
    CallActiveMember (username) {
        const globalmemoryController = require(globalConfigs.mpath1.globalmemoryController)
        let currentMember = this.activeMembers.get(username)

        if (!currentMember) {
            let newuser = {name: username, weight: 0, sentto: [], userpointer: globalmemoryController.GlobalActiveUser.callUsersV2(username)}
            this.activeMembers.set(username, newuser)
            this.Debug_activeMembers.push(newuser)
            this.changed = true
        } else {
            console.log("user already active")
        }

    }
    getMemberActivity (message) {
        const globalmemoryController = require(globalConfigs.mpath1.globalmemoryController)
        console.log('----------Remote get Member Activity')
        if (message) {
            let currentMember = this.activeMembers.get(message.username)
            switch (message.action) {
                case "call":
                    if (!currentMember) {
                        let newuser = {name: message.username, weight: 0, sentto: [], userpointer: globalmemoryController.GlobalActiveUser.callUsersV2(message.username)}
                        this.activeMembers.set(message.username, newuser)
                        this.Debug_activeMembers.push(newuser)
                        this.changed = true
                    }
                    break
                case "change":
                    this.changed = true
                    break
                case "remove":
                    if (currentMember) {
                        this.activeMembers.delete(message.username)
                        this.changed = true
                    } else {
                        console.log("already not in this")
                    }
                    break
            }
        }
    }
    monitorActiveMember (res) {
        let messages = "RemoteDesktopP2PObj Scheduler Active Member . Object Persisted ID : " + this.persisted_id + "\n" +
            "----------------------------------------------------------------------------------\n"
        for (let i of this.Debug_activeMembers) {
            messages += JSON.stringify(i, null, 4) + "\n"
        }
        res.send(messages)
    }
    start_Calculation_Scheduling () {
        if (this.active === false) {
            this.active = true
            this.calculateSchedule = setInterval(
                () => {
                    if (this.changed === true) {
                        this.ReCalculate()
                        this.changed = false
                    }
                }, this.calculateIntervalTime
            )
        } else {
            console.log("already schedule")
        }
    }

    stop_Calculation_Scheduling () {
        if (this.active === true) {
            clearInterval(this.calculateSchedule)
            this.calculateSchedule = null
            console.log("calculate is stoped")
        } else {
            console.log("already not schedule")
        }
    }

    ReCalculate () {



        if (this.read_lock === false) {
            this.read_lock = true

            for (let i of this.setofDeliver) {
                this.setofDeliver.push(i)
            }
            this.Distribute_to_Receiver()
            this.print_Deliver()
            this.read_lock = false
        } else {
            console.log("there is other operation working")
        }
    }

    clearDeliRecei () {
        if (this.read_lock === true) {
            console.log("there is other operation working")
        }
        this.read_lock = true

        this.setofDeliver = []
        this.setofFulledDeliver = []
        this.setofReceiver = []
        this.tmpDeliver = []

        this.read_lock = false
    }

    Push_Deliver (membername) {
        this.setofDeliver.push({name: membername, weight: 0, ipaddr: "", port: "", sentto: []})
        this.print_Deliver()
    }
    Push_Receiver (membername) {
        this.setofReceiver.push({name: membername, weight: 0, ipaddr: "", port: "", sentto: []})
        this.print_Receiver()
    }
    Distribute_to_Receiver () {
        let iterations = 0
        let currentallweight = this.maximumDelivingPerNode
        while (this.setofReceiver.length !== 0) {
            iterations++
            console.log("iteration : " + iterations)
            if (currentallweight <= 0) {
                currentallweight = 0
                while (this.setofDeliver.length > 0) {
                    this.setofFulledDeliver.push(this.setofDeliver.pop())
                }
                while (this.tmpDeliver.length > 0) {
                    this.setofDeliver.push(this.tmpDeliver.pop())
                    currentallweight += this.maximumDelivingPerNode
                }
            }

            for (let currentdeliver of this.setofDeliver) {
                //console.log("currentdeliver " + JSON.stringify(currentdeliver, null, 4))

                if (this.setofReceiver.length === 0) {
                    break
                }
                if (currentdeliver.weight >= this.maximumDelivingPerNode) {
                    continue
                }
                currentdeliver.weight++
                currentallweight--
                let popReceiver = this.setofReceiver.pop()
                currentdeliver.sentto.push(popReceiver)
                this.tmpDeliver.push(popReceiver)
            }
        }
        console.log("end")
    }
    print_Deliver () {
        //console.log(this.setofDeliver)
        console.log("printing set of Deliver")
        for (let i of this.setofDeliver) {
            console.log(i)
        }
        for (let i of this.setofFulledDeliver) {
            console.log(i)
        }
        for (let i of this.tmpDeliver) {
            console.log(i)
        }
    }
    print_Receiver () {
        let all = ""
        for (let i of this.setofReceiver) {
            all += i.name + " "
        }
        console.log("printing set of Receiver")
        console.log(all)
    }
    SendMessagesToClient () {

    }
    HeartBeatCheck () {

    }

}
class Group_RemoteDesktop  {
    constructor () {
        this.RemoteDesktopP2PScheduler = new HashArray('id')
        this.Debug_RemoteDesktopP2PScheduler = []
    }
    async callObject (id, username) {
        let validation = true
        let currentObject = this.RemoteDesktopP2PScheduler.get(id)
        let outputdocs
        if (currentObject) {
            console.log("Object already in Memory")
        } else {
            const collection = mongotools.db.collection('users')
            //console.log("id: " + id)
            await new Promise (resolve => {
                collection.findOne(

                    {/*'name': username,*/ 'clouddrive.remotedobj._id': safeObjectId(id)},

                    {'clouddrive.remotedobj._id':1},

                    (err, docs) => {
                        if (err) {
                            console.log('database error')
                            validation = false
                        } else if (docs) {
                            console.log("found object in database")
                            outputdocs = docs
                            console.log(docs)
                        } else {
                            console.log('data not found in record')
                            validation = false
                        }
                        return resolve()
                    }
                )
            })
            if (validation && outputdocs) {
                let OneObject = new One_Scheduler_RemoteDesktopP2P(id)
                this.RemoteDesktopP2PScheduler.add({id: id, data: OneObject})
                this.Debug_RemoteDesktopP2PScheduler.push(OneObject)
            }
        }
        return currentObject
    }

    async getMessages (messages) {
        console.log('-----------Global Remote Object Get Message ')
        let currentObject = await this.callObject(messages.objectID, messages.username)
        if (!currentObject) {
            console.log("object not found in database")
            return null
        }

        //console.log(currentObject.data)
        console.log("passing remote")
        return currentObject.data
    }
}


module.exports.One_Scheduler_RemoteDesktopP2P = One_Scheduler_RemoteDesktopP2P
module.exports.Group_RemoteDesktop = Group_RemoteDesktop