/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//////////////////////////Requirement Section////////////////////////
/////////////////////////////////////////////////////////////////////
///////**//This code require javascript version 6 or newer//**///////
////////////////////////miscellaneous////////////////////////////////

const chalk = require('chalk')
const HashArray = require('hasharray')
const Client = require('node-rest-client').Client
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

class OneObjectLinks {
    constructor (objectlink_persistedID, object_persistedID, owner_persistedID) {
        this.persistedID = objectlink_persistedID
        this.object_persistedID = object_persistedID
        this.owner_persistedID = owner_persistedID
        this.owner_name = ""
        this.name = ""
        this.positionX = 0
        this.positionY = 0
    }
    changePosition (newX, newY) {
        this.positionX = newX
        this.positionY = newY
    }
    changeName (newName) {
        this.name = newName
    }
    changeOwnerName (newName) {
        this.owner_name = newName
    }
}

class World_Events_Stamp {
    constructor () {
        this.eventname = ""

    }
}

class OneActiveWorldClass {
    constructor (world_persistedID, name) {
        this.name = name
        this.persistedID = world_persistedID
        this.ObjectLinks = new Map()
        this.activeMembers = new Map()
        this.changed = false

        this.BroadcastErrorEvents = []
    }

    getObjectLinkReference (object_persistedID) {
        return this.ObjectLinks.get(object_persistedID)[1]
    }

    async loadAllObjectLink () {
        let allobj = await WorldMethods.returnall_objectlink(this.persistedID)
        for (let i of allobj.objectlinks) {
            //console.log(i)
            await this.addnewObjectLink(i._id, i.object_persisted_id, i.owner_persisted_id, i.owner_name, i.object_name, i.positionX, i.positionY)
        }
        console.log(this.ObjectLinks)

    }


    async saveAllObjectLink () {
        for (let i of this.ObjectLinks) {
            WorldMethods.saveUpdateObjectLink(this.persistedID, i._id, {positionX:i.positionX, positionY:i.positionY})
        }
    }
    async addnewObjectLink (objectlink_persistedID ,object_persistedID, owner_persistedID, owner_name, object_name, positionX, positionY, optional) {

        console.log("links persistedID " + objectlink_persistedID)
        console.log("delete test : " + this.ObjectLinks.delete(String(objectlink_persistedID)))

        let newObjectLink = new OneObjectLinks(objectlink_persistedID,object_persistedID, owner_persistedID)
        if (object_name) {
            newObjectLink.changeName(object_name)
        }
        if (owner_name) {
            newObjectLink.changeOwnerName(owner_name)
        }
        if (positionX && positionY) {
            newObjectLink.changePosition(positionX, positionY)
        }
        this.ObjectLinks.set(String(objectlink_persistedID), newObjectLink)

    }



    removeObjectLink (persistedID, optional) {

    }

    removeActiveMember (username) {
        console.log('------------------------------------At Remote OBJ : Receive remove message ')
        console.log()

        if (this.activeMembers.delete(username)) {
            this.changed = true
        } else {
            console.log("already not in this")
        }
    }
    forceChangeActiveMember () {
        this.changed = true
    }
    async callActiveMember (username) {
        console.log('------------------------------------At Remote OBJ : Receive call message ')
        console.log()

        const globalmemoryController = require(globalConfigs.mpath1.globalmemoryController)

        if (!(await WorldMethods.isMember(username,this.persistedID))) {
            console.log("this user is not a member")
            return false
        }

        let currentMember = this.activeMembers.get(username)

        if (!currentMember) {
            let userpointer = await globalmemoryController.GlobalActiveUser.callUsersV2(username)

            this.activeMembers.set(username, userpointer)
            //this.Debug_activeMembers.push(newuser)
            this.changed = true
        } else {
            console.log("user already active")
        }
        return true
    }

    monitorActiveMember (res) {
        let messages = "RemoteDesktopP2PObj Scheduler Active Member . Object Persisted ID : " + this.persistedID + "\n" +
            "----------------------------------------------------------------------------------\n"
        for (let i of this.activeMembers) {
            //console.log(i)
            messages += i[1].name + "\n"
        }
        res.send(messages)
    }

    monitorObject (res) {
        res.end()
    }

    signalBroadcast (data) {
        console.log("show active member")
        //console.log(this.activeMembers)

        for (let i of this.activeMembers) {
            console.log("username : " + i[0])
            console.log("ip : "+i[1].data.ipaddr)
            console.log("port : "+i[1].data.port)
            //this.signalUnicast(i[1].data.ipaddr, i[1].data.port, {})
        }

    }

    signalUnicast (ip, port, data) {
        let args = {
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }
        client.post("http://"+ip+":"+port+"/action", args, (data, response) => {

        })
    }
}
class GlobalActiveWorldClass {
    constructor () {
        this.activeWorld = new HashArray('id')
        this.debugactiveWorld = []
    }
    async callWorld (persistedID) {
        let validation = true
        let currentWorld = this.activeWorld.get(persistedID)
        //console.log("show query world persisted ID : " + persistedID)
        //console.log("++++++++++Call world +++++++++++++")
        let outputdocs
        if (currentWorld) {
            console.log("World already in Memory")
            return currentWorld
        } else {
            const collection = mongotools.db.collection('worlds')
            await new Promise(resolve => {
                collection.findOne(

                    {'_id': safeObjectId(persistedID)},

                    {_id: 1, name: 1},

                    (err, docs) => {
                        if (err) {
                            console.log('database error')
                            validation = false
                        } else if (docs) {
                            console.log("found world in database")
                            outputdocs = docs
                            //console.log(docs)
                        } else {
                            console.log('data not found in record')
                            validation = false
                        }
                        return resolve()
                    }
                )
            })
            if (validation && outputdocs) {
                let OneWorld = new OneActiveWorldClass(outputdocs._id, outputdocs.name)
                this.activeWorld.add({id: outputdocs._id, data: OneWorld})
                this.debugactiveWorld.push(OneWorld)
                return {data: OneWorld}
            }
        }
    }


    async getMessage () {

    }
    async getWorldReference (messages) {
        let currentObject = await this.callWorld(messages.worldID)
        if (!currentObject) {
            console.log("world not found in database")
            return null
        }
        //console.log("getWorldREference Test")
        //console.log(currentObject)
        return currentObject.data
    }

    monitorGlobalWorld (res) {
        let messages = "Global World Controller\n" +
            "----------------------------------------------------------------------------------\n"
        for (let i of this.debugactiveWorld) {
            messages += JSON.stringify(i, null, 4)
        }
        res.send(messages)
    }

    async Monitor (req, res) {
        let passfirst = false
        switch (req.body.type) {
            case "globalobject":
                passfirst = true
                this.monitorGlobalWorld(res)
                break
        }

        if (!passfirst) {
            let currentWorld = await this.getWorldReference({worldID: req.body.worldID})
            if (currentWorld) {
                switch (req.body.type) {
                    case "activemember":
                        currentWorld.monitorActiveMember(res)
                        break
                    case "object":
                        //console.log("show object")
                        //console.log(currentWorld.data)
                        currentWorld.monitorObject(res)
                        break
                    default:
                        res.end()
                        break
                }
            } else {

            }
        }
    }
}

class World {
    constructor (name, persisted_id) {
        this.name = name
        this.persisted_id = persisted_id
        this.activeMembers = new Map()
        this.groupofMembers = new Map()
        this.Objectlinks = new Map()
        this.invitations = []
    }
    force_refresh_from_Persisted ()  {

    }
    force_refresh_to_Persisted () {

    }

    get_active_member () {
        console.log("size: " + this.groupofMembers.size)
        for (let [key, value] of this.activeMembers) {
            console.log(key + " = " + JSON.stringify(value,null, 4))
        }
    }

    set_member_active (membername) {
        let currentmember = this.activeMembers.get(membername)
        if (currentmember) {
            if (currentmember.isActive) {
                console.log("member already active")
            } else {
                currentmember.isActive = true
            }
        } else {
            this.activeMembers.set(

                membername,

                {
                    isActive: true,
                    isStandby: false,
                    mongoid: null,
                    ipaddress: "192.168.1.1",
                    port: null,
                    positionx: 0,
                    positiony: 0,
                    peerworkload: [],
                    peerworkloadweight: 0
                }

            )

        }
    }

    set_member_nonactive (membername) {
        let currentmember = this.activeMembers.get(membername)
        if (currentmember) {
            if (!currentmember.isActive) {
                console.log("member already not active")
            } else {
                currentmember.isActive = false
            }
        } else {
            console.log("member not active and not in the cache")
        }
    }

    addUser(Username,GroupofMemberName) {
        let currentgroup = this.groupofMembers.get(GroupofMemberName).members
        currentgroup.push("cheevarit")
        currentgroup.push("david")
        currentgroup.push("sarah")
        console.log(this.groupofMembers.get(GroupofMemberName))

    }
    addGroupofMember () {
        //console.log("hello world")

        this.groupofMembers.set('admin' ,{members: new Set()})
        this.groupofMembers.set('standard', {members: new Set()})
        this.getGroupofMemberInfo()

        this.addUser("cheevarit","admin")

    }
    getGroupofMemberInfo () {
        console.log("size: " + this.groupofMembers.size)
        for (let [key, value] of this.groupofMembers) {
            console.log(key + " = " + JSON.stringify(value,null, 4))
        }
    }




}

class WorldMethods {

    /**
     * add user acceptance invation to the world
     * @param req
     * @param req.body.worldname - name of destination world
     * @param req.body.name - name of user to send member accept invitation
     * @param res
     * @returns {Promise<void>}
     */
    static async addMemberToInvitation (req, res) {
        const collection = mongotools.db.collection('worlds')
        await new Promise(resolve => {
            /*
            collection.updateOne(
                {name: req.body.name},
                {$set :
                        {
                            Invitations :
                                [
                                    {  member: [] }
                                ]
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
            */
            //console.log(req.body.name)
            collection.updateOne(
                {name: req.body.worldname},
                {$addToSet :
                        {"Invitations.member": req.body.name}
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
    }

    /** @param
     *
     * @param req
     * @param req.body.worldname - name of destination world
     * @param req.body.name - name of user to add
     * @param res
     * @returns {Promise<void>}
     */
    static async acceptMember (req, res) {
        const collection = mongotools.db.collection('worlds')
        let validation = true
        if (validation) {
            await new Promise(resolve => {
                collection.updateOne(
                    {name: req.body.worldname},

                    {
                        $pull:
                            {
                                "Invitations.member": req.body.name
                            }
                    },

                    (err, response) => {
                        if (err) {
                            console.log("Error " + err)
                        } else {
                            console.log(response.result)
                            if (response.result.nModified === 0) {
                                console.log("validation go false")
                                validation = false
                            }
                        }
                        return resolve()
                    }
                )
            })
        }
        if (validation) {
            await new Promise(resolve => {
                let groupobject = {}
                collection.updateOne(
                    {name: req.body.worldname},
                    {
                        $addToSet:
                            {"member.standard": req.body.name}
                        //groupobject["member."+req.body.group] = req.body.name
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
        }
        res.end()

    }

    static async addObjectLink (object_persistedID, world_persistedID, objectOwner_name, optional) {
        const world_collection = mongotools.db.collection('worlds')
        const user_collection = mongotools.db.collection('users')
        let validation = true
        let objectOwnerID = ""
        if (validation) {
            await new Promise(resolve => {

                user_collection.findOne(

                    {name: objectOwner_name, "clouddrive.remotedobj._id": safeObjectId(object_persistedID)},

                    {_id: 1},

                    (err, response) => {
                        if (err) {
                            console.log("error " + err)
                            validation = false
                        } else if (response) {
                            console.log(response)
                            objectOwnerID = response._id
                        } else {
                            console.log("error response not found")
                            validation = false
                        }
                        return resolve()
                    }

                )

            })
        }
        //console.log("world id : " + world_persistedID)
        if (validation) {
            await new Promise(resolve => {

                world_collection.updateOne(

                    {_id: safeObjectId(world_persistedID)},

                    {$push :
                            {
                                "objectlinks": {
                                    _id: new ObjectID(),
                                    owner_name: objectOwner_name,
                                    owner_persisted_id: objectOwnerID,
                                    object_name: optional.name ? optional.name : "",
                                    object_persisted_id: object_persistedID,
                                    positionX: optional.positionX ? optional.positionX : "",
                                    positionY: optional.positionY ? optional.positionY : ""
                                }
                            }
                    },

                    (err, response) => {
                        if (err) {
                            console.log("Error " + err)
                            validation = false
                        } else if (response) {
                            console.log(response.result)
                        } else {
                            console.log("error response not found")
                            validation = false
                        }
                        return resolve()
                    }

                )

            })

        }

    }

    static async returnall_objectlink (world_persistedID) {
        const collection = mongotools.db.collection('worlds')
        let validation = true
        let outputdocs = null;
        await new Promise(resolve => {
            collection.findOne(

                {'_id': safeObjectId(world_persistedID)},

                {objectlinks: 1},

                (err, docs) => {
                    if (err) {
                        console.log('database error')
                        validation = false
                    } else if (docs) {
                        console.log("found world in database")
                        outputdocs = docs
                        //console.log(docs)
                    } else {
                        console.log('data not found in record')
                        validation = false
                    }
                    return resolve()
                }
            )
        })
        return outputdocs
    }

    static async saveUpdateObjectLink (world_persistedID, objectlink_persistedID, updatelist) {
        const collection = mongotools.db.collection('worlds')
        let validation = true

        let setobject = {}
        if (updatelist) {
            if (updatelist.owner_name && updatelist.owner_persisted_id) {
                setobject["objectlinks.$.owner_name"] = updatelist.owner_name
                setobject["objectlinks.$.owner_persisted_id"] = updatelist.owner_persisted_id
            }
            if (updatelist.positionX || updatelist.positionY) {
                setobject["objectlinks.$.positionX"] = Number(updatelist.positionX)
                setobject["objectlinks.$.positionY"] = Number(updatelist.positionY)
            }
        }
        console.log("show setobject ")
        console.log(setobject)


        await new Promise(resolve => {
            collection.findOneAndUpdate(

                {'_id': safeObjectId(world_persistedID), 'objectlinks._id': safeObjectId(objectlink_persistedID)},

                {$set : setobject},

                (err, docs) => {
                    if (err) {
                        console.log('database error')
                        validation = false
                    } else if (docs) {
                        console.log("found world in database")
                        //outputdocs = docs
                        console.log(docs)
                    } else {
                        console.log('data not found in record')
                        validation = false
                    }
                    return resolve()
                }
            )
        })

    }

    static async isMember (userName ,world_persistedID) {
        const collection = mongotools.db.collection('worlds')
        let validation = true
        console.log("world " + world_persistedID)
        console.log("username " + userName)
        if (validation) {
            await new Promise(resolve => {
                collection.findOne(
                    {_id: safeObjectId(world_persistedID), "member.standard": userName},

                    {_id:1},

                    (err, docs) => {
                        if (err) {
                            console.log("Error " + err)
                            validation = false
                        } else if (docs) {
                            console.log(docs)
                            validation = true
                            /*
                            if (response.result.nModified === 0) {
                                console.log("validation go false")
                                validation = false
                            }
                            */
                        } else {
                            console.log("response not return")
                            validation = false
                        }
                        return resolve()
                    }
                )
            })
        }
        return validation
    }


    /**
     * Create new world
     * @param req
     * @param req.body.name
     * @param req.body.adminpassword
     * @param res
     * @returns {Promise<void>}
     */
    static async createNew (req, res) {
        console.log(JSON.stringify(req.body))
        let validation = true
        let filteroptions = {
            bool_permitprob: true,
            setarr_permitprob: new Set(['name','adminpassword'])
        }
        let filter = toolController.RequestFilter(req.body, filteroptions)
        if (filter.validation_numprob === false) {
            console.log(filter.validation_message)
            validation = false
            return res.end()
        }


        const collection = mongotools.db.collection('worlds')

        if (validation) {
            await new Promise (resolve => {
                collection.findOne(

                    {'name':req.body.name}

                    ,(err, docs) => {
                        if (err) {
                            console.log('database error')
                        } else if (docs) {
                            validation = false
                            console.log("world's name already found in the database")
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

module.exports.WorldMethods = WorldMethods
module.exports.OneObjectLinks = OneObjectLinks
module.exports.OneActiveWorldClass = OneActiveWorldClass
module.exports.GlobalActiveWorldClass = GlobalActiveWorldClass