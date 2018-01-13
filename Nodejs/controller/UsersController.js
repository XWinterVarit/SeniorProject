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
        this.active_at_world = ""
        this.active_at_objectID = ""

        this.heartbeatIntervalTime = 1000 //millisec
        this.heartbeatTimer = null
        this.heartbeatScore = 0
    }

    set_active_world (worldname) {
        if (this.active_at_world === worldname){
            console.log("not change active world")
        } else {
            this.active_at_world = worldname
            console.log("change activeworld")
        }
    }

    async set_active_objectID (objectID, objecttype, username) {
        const globalmemoryController = require(globalConfigs.mpath1.globalmemoryController)

        if (this.active_at_objectID === objectID){
            console.log("not change active object")
        } else {
            console.log("change activeobject")
            this.active_at_objectID = objectID
            switch (objecttype) {
                case "remote":
                    let previousObject = await globalmemoryController.GlobalRemoteDesktopOBJ.getMessages({objectID: this.active_at_objectID, username: username})
                    //console.log("show previous object")
                    //console.log(previousObject)
                    if (previousObject) {
                        previousObject.removeActiveMember(username)
                    }
                    let nextObject = await globalmemoryController.GlobalRemoteDesktopOBJ.getMessages({objectID: objectID})
                    if (nextObject) {
                        //console.log(nextObject)
                        nextObject.CallActiveMember(username)
                    }
                    console.log("completed")
                    break
            }
        }
    }

    set_IP (ip) {
        const globalmemoryController = require(globalConfigs.mpath1.globalmemoryController)
        if (this.ipaddr === ip){
            console.log("ip not change")
        } else {
            console.log("ip changed")
            this.ipaddr = ip
            let currentObject = await globalmemoryController.GlobalRemoteDesktopOBJ.get_messages()
        }
    }

    set_port (port) {
        if (this.port === port){
            console.log("port not change")
        } else {
            console.log("port change")
            this.port = port
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
        this.signal_heartbeat()
        if (req.body.standby !== undefined) {
            this.standby = req.body.standby
        }
        if (req.body.ipaddr) {
            this.set_IP(req.body.ipaddr, req.body.name)
        }
        if (req.body.port) {
            this.set_port(req.body.port, req.body.name)
        }
        if (req.body.activeworld) {
            this.set_active_world(req.body.activeworld, req.body.name)
        }
        if (req.body.activeobject) {
            await this.set_active_objectID(req.body.activeobject, req.body.objecttype, req.body.name)
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
        }
        res.send(messages)

    }

    async get_messages (req) {
        //console.log(JSON.stringify(req.body,null, 4))
        //await this.callUsers(req.body.name)
        console.log('-----------Global User Get Message ')
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
                currentUser.get_messages(req)
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