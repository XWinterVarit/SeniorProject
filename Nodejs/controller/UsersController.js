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
/////////////////////////////from redis//////////////////////////////

const redistools = require(globalConfigs.mpath1.redis).tools
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////


//==================================================================================================
//==================================================================================================
//==================================================================================================

class OneActiveUserClass {
    constructor (persisted_id, name) {
        this.persisted_id = persisted_id
        this.name = name
        this.ipaddr = ""
        this.port = ""
        this.standby = false
        this.active = false
        this.active_at_world = "" //ID
        this.active_at_objectID = ""
        this.objectowner = ""

        this.heartbeatIntervalTime = 1000 //millisec
        this.heartbeatTimer = null
        this.heartbeatScore = 0



        this.requestQueue = []
        this.firstLOCK = true //first load from database
    }

    async set_active_world (worldID, req) {
        const globalmemoryController = require(globalConfigs.mpath1.globalmemoryController)


        if (this.active_at_world === worldID){
            console.log("not change active world")
            let currentWorld = await globalmemoryController.GlobalActiveWorld.getWorldReference({worldID: this.active_at_world})
            if (!currentWorld) {
                console.log("current world not found")
            } else {
                await currentWorld.INPUT_request_message(req)
            }
        } else {
            console.log("change activeworld")

            let previousWorld = await globalmemoryController.GlobalActiveWorld.getWorldReference({worldID: this.active_at_world})
            let nextWorld = await globalmemoryController.GlobalActiveWorld.getWorldReference({worldID: worldID})

            if (!previousWorld) {
                console.log("previous world not found")
            } else {
                previousWorld.removeActiveMember(this.name)
                this.active_at_world = ""
            }

            if (!nextWorld) {
                console.log("next World not found")
            } else {
                await nextWorld.callActiveMember(this.name, new nextWorld.OPTIONAL_TEMPLATE_callActiveUser(null, null, null, true))
                this.active_at_world = worldID
                await nextWorld.INPUT_request_message(req)
            }
        }

    }

    async set_active_objectID (objectID, objecttype, newobjectowner) {
        const globalmemoryController = require(globalConfigs.mpath1.globalmemoryController)

        if (this.active_at_objectID === objectID){
            console.log("not change active object")
        } else {
            console.log("change activeobject")
            switch (objecttype) {
                case "remote":
                    console.log(chalk.blue("// call remote object //"))


                    let previousObject = await globalmemoryController.GlobalRemoteDesktopOBJ.getMessages({objectID: this.active_at_objectID, objectowner: this.objectowner})
                    //console.log("show previous object")
                    //console.log(previousObject)
                    if (previousObject) {
                        previousObject.removeActiveMember(this.name)
                    }
                    let nextObject = await globalmemoryController.GlobalRemoteDesktopOBJ.getMessages({objectID: objectID, objectowner: newobjectowner})
                    console.log("print next object")
                    //console.log(nextObject)

                    if (nextObject) {
                        await nextObject.CallActiveMember(this.name)
                    }
                    console.log("completed")
                    break
            }
            this.active_at_objectID = objectID
            this.objectowner = newobjectowner
        }
    }

    async set_IP (ip) {
        const globalmemoryController = require(globalConfigs.mpath1.globalmemoryController)
        if (this.ipaddr === ip){
            console.log("ip not change")
        } else {
            console.log("ip changed")
            this.ipaddr = ip
            let currentObject = await globalmemoryController.GlobalRemoteDesktopOBJ.getMessages({objectID: this.active_at_objectID, objectowner: this.objectowner})
            if (currentObject) {
                currentObject.forceChangeActiveMember()
            }
        }
    }

    async set_port (port) {
        const globalmemoryController = require(globalConfigs.mpath1.globalmemoryController)
        if (this.port === port){
            console.log("port not change")
        } else {
            console.log("port change")
            this.port = port
            let currentObject = await globalmemoryController.GlobalRemoteDesktopOBJ.getMessages({objectID: this.active_at_objectID, objectowner: this.objectowner})
            if (currentObject) {
                currentObject.forceChangeActiveMember()
            }
        }
    }

    start_heartbeat () {
        this.active = true
        /*
              if (this.heartbeatTimer === null) {

              } else {
                  clearTimeout(this.heartbeatTimer)
              }

              this.heartbeatTimer = setTimeout(
                  () => {
                      this.active = false
                  }, this.heartbeatIntervalTime
              )
      */
        this.heartbeatTimer = setInterval(
            () => {
                this.heartbeatScore--
                if (this.heartbeatScore <= 0) {
                    clearInterval(this.heartbeatTimer)
                    this.active = false
                    this.set_active_world("",{})
                }
            }, this.heartbeatIntervalTime
        )

    }

    signal_heartbeat () {
        this.heartbeatScore = 20
        if (this.active === false) {
            this.start_heartbeat()
        }
    }

    async get_messages (req) {
        //console.log("hello from : " + this.name + "  " + this.persisted_id)
        console.log('--------------------Receive Second at each User Controller ')
        console.log()
        this.signal_heartbeat()

        if (req.body.standby !== undefined) {
            this.standby = req.body.standby
        }

        if (req.body.activeworld) {
            await this.set_active_world(req.body.activeworld, req)
        }
        if (req.body.activeobject) {
            await this.set_active_objectID(req.body.activeobject, req.body.objecttype, req.body.objectowner)
        }

        if (req.body.ipaddr) {
            await this.set_IP(req.body.ipaddr, req.body.name)
        }
        if (req.body.port) {
            await this.set_port(req.body.port, req.body.name)
        }


    }

    sent_messages () {

    }


}

class GlobalActiveUserClass {
    constructor () {
        this.ActiveUsers = new HashArray('name')
        this.Debug_ActiveUsers = []
    }

    async callUsers (name) {
        let validation = true
        let currentUser = this.ActiveUsers.get(name)
        let outputdocs
        if (currentUser) {
            console.log("User already in GlobalActiveUser")
        } else {
            const collection = mongotools.db.collection('users')
            await new Promise (resolve => {
                collection.findOne(

                    {'name': name},

                    {_id:1},

                    (err, docs) => {
                        if (err) {
                            console.log('database error')
                            validation = false
                        } else if (docs) {
                            console.log("found user in database")
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

                let OneUser = new OneActiveUserClass(outputdocs._id, name)
                //for concurrency bug : this.ActiveUsers.has()
                this.ActiveUsers.add({name: name, data: OneUser})
                this.Debug_ActiveUsers.push(OneUser)
            }
        }
        return validation
    }
    async callUsersV2 (name) {
        let validation = true
        let currentUser = this.ActiveUsers.get(name)
        let outputdocs
        if (currentUser) {
            console.log("User already in GlobalActiveUser")
        } else {
            const collection = mongotools.db.collection('users')
            await new Promise (resolve => {
                collection.findOne(

                    {'name': name},

                    {_id:1},

                    (err, docs) => {
                        if (err) {
                            console.log('database error')
                            validation = false
                        } else if (docs) {
                            console.log("found user in database")
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

                let OneUser = new OneActiveUserClass(outputdocs._id, name)
                this.ActiveUsers.add({name: name, data: OneUser})
                this.Debug_ActiveUsers.push(OneUser)
            }
        }
        return currentUser
    }
    printall_activeuser () {

        for (let currentuser of this.Debug_ActiveUsers) {
            console.log(currentuser.name)
        }

        //console.log(JSON.stringify(this.ActiveUsers,null, 4))

    }

    monitor_activeuser (res) {

        let messages = "users\n"
        for (let currentuser of this.Debug_ActiveUsers) {
            messages += "name: " + currentuser.name + " id : " + currentuser.persisted_id + " isActive : " + currentuser.active + " heartbeatscore : " + currentuser.heartbeatScore + "\n"
            messages += "active at world " + currentuser.active_at_world + "  active at objectID " + currentuser.active_at_objectID + "  with owner  " + currentuser.objectowner + "\n\n"
        }
        res.send(messages)

    }

    /***
     * Call user and sent action
     * @param req
     * @param req.body.name - current username
     * @param req.body.type - type of call : toone (call only one user) , other
     * optional 0
     * @param req.body.standby - is user standby
     * optional 1
     * @param req.body.activeworld - current world persistedID user is in
     * @param req.body.activeobject - current object persistedID user focus on
     * @param req.body.objectowner - current object owner name user focus on
     * optional 2
     * @param req.body.ipaddr - if change to new ipaddr
     * @param req.body.port - if change port
     * @returns {Promise<boolean>}
     */
    async get_messages (req) {
        //console.log(JSON.stringify(req.body,null, 4))
        //await this.callUsers(req.body.name)
        console.log('-----------Receive First at Global User Controller ')
        console.log()
        if (!(await this.callUsers(req.body.name))) {
            console.log("user not found in database")
            return false
        }
        let currentUser = this.ActiveUsers.get(req.body.name).data
        //console.log(currentUser)
        //console.log(req.body.type)
        console.log("passssssss")
        switch (req.body.type) {
            case "toone":
                console.log('-----------One User Get Message ')
                await currentUser.get_messages(req)
                break
            case "others":
                break
        }

    }
    set_messages (res) {

    }

}

class UserMethods {

    static async createUser (req, res) {
        console.log(JSON.stringify(req.body))
        let validation = true
        let filteroptions = {
            bool_permitprob: true,
            setarr_permitprob: new Set(['name', 'emailaddr','password'])
        }
        let filter = toolController.RequestFilter(req.body, filteroptions)
        if (filter.validation_numprob === false) {
            console.log(filter.validation_message)
            validation = false
            return res.end()
        }

        const collection = mongotools.db.collection('users')

        if (validation) {
            await new Promise (resolve => {
                collection.findOne(

                    {'name':req.body.name}

                    ,(err, docs) => {
                        if (err) {
                            console.log('database error')
                        } else if (docs) {
                            validation = false
                            console.log("user already found in the database")
                            //console.log(docs)
                        } else {
                            console.log('data not found in record')
                        }
                        return resolve()
                    }
                )
            })
        }
        if (validation) {
            await new Promise(resolve => {
                collection.insertOne(
                    req.body,
                    (err)=> {
                        if (err){
                            console.log(err)
                        }
                        return resolve()
                    }
                )
            })
            console.log("write completed")
        }
        res.end()
    }

}

module.exports.OneActiveUserClass = OneActiveUserClass
module.exports.GlobalActiveUserClass = GlobalActiveUserClass
module.exports.UserMethods = UserMethods