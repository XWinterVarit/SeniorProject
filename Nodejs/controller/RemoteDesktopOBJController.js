/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//////////////////////////Requirement Section////////////////////////
/////////////////////////////////////////////////////////////////////
///////**//This code require javascript version 6 or newer//**///////
////////////////////////miscellaneous////////////////////////////////

const chalk = require('chalk')
const HashArray = require('hasharray')
const AsyncLock = require('async-lock')
const CircularJSON = require('circular-json')
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
    constructor (persisted_id, objectowner) {

        this.objectowner = objectowner
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
        this.calculateIntervalTime = 5000 // millisec

        this.lock_activeMembers = new AsyncLock({maxPending: 1000})
    }
    removeActiveMember (username) {
        console.log('------------------------------------At Remote OBJ : Receive remove message ')
        console.log()

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
    async CallActiveMember (username) {
        console.log('------------------------------------At Remote OBJ : Receive call message ')
        console.log()

        const globalmemoryController = require(globalConfigs.mpath1.globalmemoryController)
        let currentMember = this.activeMembers.get(username)

        if (!currentMember) {
            let userpointer = await globalmemoryController.GlobalActiveUser.callUsersV2(username)
            let newuser = {name: username, weight: 0, sentto: [], userpointer: userpointer}
            this.activeMembers.set(username, newuser)
            //this.Debug_activeMembers.push(newuser)
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
        for (let i of this.activeMembers) {
            messages += i[1].name + " weight : " + i[1].weight
        }
        res.send(messages)
    }

    monitorObject () {
        let messages = "RemoteDesktopP2PObj Scheduler Status . Object Persisted ID : " + this.persisted_id + "\n" +
            "----------------------------------------------------------------------------------\n"
        messages += "isActive : " + this.active + "  isChanged : " + this.changed + "  isSchedule "
        if (this.calculateSchedule) {
            messages += "YES" + "   at " + this.calculateIntervalTime + " millisec. per interval\n"
        } else {
            messages += "NO" + "   at " + this.calculateIntervalTime + " millisec. per interval\n"

        }
        for (let i of this.activeMembers) {
            messages += i[1].name + " weight : " + i[1].weight + " "
        }

        return messages
    }

    start_Calculation_Scheduling () {
            if (this.active !== false) {
                this.calculateSchedule = setInterval(
                    () => {
                        if (this.changed === true) {
                            this.ReCalculate()
                            this.changed = false
                        } else {
                            console.log("this object has not been changed")
                        }
                    }, this.calculateIntervalTime
                )
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
            console.log("Recalculating..")
            this.clearDeliRecei()
            for (let i of this.activeMembers) {
                //console.log(`show objectowner name : ${this.objectowner}`)
                //console.log("active mem : " + JSON.stringify(i[1].name))
                i[1].sentto = []
                i[1].weight = 0
                if (i[1].name !== this.objectowner) {
                    this.setofReceiver.push(i[1])
                } else {
                    this.setofDeliver.push(i[1])
                }
            }
            if (this.setofDeliver.length !== 0) {
                this.Distribute_to_Receiver()
                this.print_Deliver()
            } else {
                console.log("owner object is not active")
            }

    }

    clearDeliRecei () {
        this.setofDeliver = []
        this.setofFulledDeliver = []
        this.setofReceiver = []
        this.tmpDeliver = []
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
        while (this.setofReceiver.length !== 0 && iterations <= 50) {
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
                //console.log('*************')
                //console.log(`currentdeliver : ${currentdeliver.name}  weight : ${currentdeliver.weight} sentto : ${currentdeliver.sentto}`)

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
            console.log(i.name + " weight : " + i.weight + " sent to :  ")
            for (let sentdest of i.sentto) {
                console.log("      " + sentdest.name)
            }
        }
        for (let i of this.setofFulledDeliver) {
            console.log(i.name + " weight : " + i.weight + " sent to :  ")
            for (let sentdest of i.sentto) {
                console.log("      " + sentdest.name)
            }
        }
        for (let i of this.tmpDeliver) {
            console.log(i.name + " weight : " + i.weight + " sent to :  ")
            for (let sentdest of i.sentto) {
                console.log("      " + sentdest.name)
            }
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
    async callObject (id, objectowner) {
        if (!safeObjectId(id) || !objectowner) {
            return null
        }
        let validation = true
        let currentObject = this.RemoteDesktopP2PScheduler.get(id)
        let outputdocs
        if (currentObject) {
            console.log("Object already in Memory")
            return currentObject
        } else {
            const collection = mongotools.db.collection('users')
            console.log("id: " + safeObjectId(id))
            console.log("object owner : " + objectowner)
            await new Promise (resolve => {
                collection.findOne(

                    {$and: [{'name': objectowner}, {'clouddrive.remotedobj._id': safeObjectId(id)}]},

                    /*{'_id': 1},*/
                    {'_id':1},

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
                let OneObject = new One_Scheduler_RemoteDesktopP2P(id, objectowner)
                this.RemoteDesktopP2PScheduler.add({id: id, data: OneObject})
                this.Debug_RemoteDesktopP2PScheduler.push(OneObject)
                return {data:OneObject}
            }
        }
    }

    async getMessages (messages) {
        console.log('-----------Global Remote Object Get Message ')
        let currentObject = await this.callObject(messages.objectID, messages.objectowner)
        if (!currentObject) {
            console.log("object not found in database")
            return null
        }
        currentObject.data.start_Calculation_Scheduling()
        //console.log(currentObject.data)
        console.log("passing remote")
        return currentObject.data
    }

    monitorglobalobject (res) {
        let messages = "Global RemoteDesktop OBJ Controller\n" +
            "----------------------------------------------------------------------------------\n"

        for (let i of this.Debug_RemoteDesktopP2PScheduler) {
            messages += JSON.stringify(i ,null, 4)
        }
        //messages += "good morning"
        res.send(messages)
    }

    async Monitor (req, res) {
        //console.log(req.body)
        let currentObject = await this.callObject(req.body.objectID, req.body.objectowner)

        switch (req.body.type) {
            case "activemember":
                //console.log("show object")
                //console.log(currentObject.data)
                currentObject = currentObject.data
                currentObject.monitorActiveMember(res)
                break
            case "object":
                //console.log("show object")
                //console.log(currentObject.data)
                currentObject = currentObject.data
                currentObject.monitorObject(res)
                break
            case "globalobject":
                this.monitorglobalobject(res)
                break
            default:
                res.end()
                break
        }
    }
}

/***
 * To create new remote desktop
 * @param req
 * @param req.body.ownername - owner name
 * @param req.body.objectname
 * @param req.body.vpath - virtual path
 */
class RemoteDesktopMethodClass {
    static async createRemoteDesktopObject (ownername, objectname, vpath) {
        const collection = mongotools.db.collection('users')
        let validation = true
        let objectID = new ObjectID()
        await new Promise(resolve => {

            collection.updateOne(

                {name: ownername},

                {$push :
                        {
                            "clouddrive.remotedobj": {
                                _id: objectID,
                                name: objectname,
                                virtualpath: vpath
                            }
                        }
                },

                (err, response) => {
                    if (err) {
                        console.log("Error " + err)
                    } else {
                        console.log(response.result)
                    }
                    return resolve()
                }
            )
        })
        return objectID.toString()
    }
}
module.exports.One_Scheduler_RemoteDesktopP2P = One_Scheduler_RemoteDesktopP2P
module.exports.Group_RemoteDesktop = Group_RemoteDesktop
module.exports.RemoteDesktopMethodClass = RemoteDesktopMethodClass