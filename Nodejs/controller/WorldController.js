/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//////////////////////////Requirement Section////////////////////////
/////////////////////////////////////////////////////////////////////
///////**//This code require javascript version 6 or newer//**///////
////////////////////////miscellaneous////////////////////////////////

const chalk = require('chalk')
const HashArray = require('hasharray')
const Client = require('node-rest-client').Client
const CircularJSON = require('circular-json')

////////////////////////////From Configs/////////////////////////////

const globalConfigs = require('../config/GlobalConfigs')
///////////////////////From Other Controllers////////////////////////

const toolController = require(globalConfigs.mpath1.toolsController)
const messagesController = require(globalConfigs.mpath1.messagesController)
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
        this.maintype = "object"
        this.subtype = ""
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
        this.activeMembers_additionInfo = new Map()
        this.changed = false

        this.BroadcastErrorEvents = []

        this.worldmatrix = new toolController.HashMatrix()
        this.worldsizeX = 40
        this.worldsizeY = 15

        this.INTERVAL_TIME_BROADCAST_FRESH_EVENT = 10000 //ms
        this.INTERVAL_BROADCAST_FRESH_EVENT = setInterval(
            () => {
                console.log(chalk.blueBright("SENT REFRESH SIGNAL TO CLIENTS"))
                this.REFRESH_ALL_toClient()
            }
            , this.INTERVAL_TIME_BROADCAST_FRESH_EVENT
        )
        this.INTERVAL_TIME_SAVE_MEMBER_INFO = 20000
        this.INTERVAL_SAVE_MEMBER_INFO = setInterval(
            () => {
                console.log(chalk.blueBright("SAVE MEMBER INFO"))
                this.saveAllMemberInfo()
            }, this.INTERVAL_TIME_SAVE_MEMBER_INFO
        )

        this.memberinfo = class {
            constructor(positionX, positionY){
                this.maintype = "member"
                this.positionX = positionX
                this.positionY = positionY
            }
            changePosition(newX, newY) {
                this.positionX = newX
                this.positionY = newY
            }
        }
        this.OPTIONAL_TEMPLATE_callActiveUser = class {
            constructor(positionX, positionY, DummySpace1, bypassposition){
                this.positionX = positionX
                this.positionY = positionY

                this.bypassposition = bypassposition
            }
        }
        this.OPTIONAL_TEMPLATE_callObjectLink = class {
            constructor(positionX, positionY, DummySpace1) {
                this.positionX = positionX
                this.positionY = positionY
            }
        }
    }


    ////////////////////////////////////////////////////////////////////////
    /////////////////////////////////Matrix/////////////////////////////////
    /////////////////////////////////Matrix/////////////////////////////////
    /////////////////////////////////Matrix/////////////////////////////////
    ////////////////////////////////////////////////////////////////////////

    getMatrixInfo () {
        this.worldmatrix.getInfo()
    }
    setPosition_inMatrix (posX, posY, objectReference) {
        console.log(chalk.green("setMatrixPosition"))
        console.log("show object reference " + objectReference)
        this.worldmatrix.set(posX, posY, objectReference)
        //console.log("show element " + this.worldmatrix.get([posX, posY]))
    }
    getData_inMatrix (posX, posY) {
        return this.worldmatrix.get(posX, posY)
    }
    removePosition_inMatrix (posX, posY) {
        console.log(chalk.green("removeMatrixPosition"))
        console.log("remove position occured at posX " + posX + " posY " + posY)
        console.log("before remove : " + JSON.stringify(this.getData_inMatrix(posX, posY), null, 4))
        this.worldmatrix.set(posX, posY, null)
        console.log("after remove : " + JSON.stringify(this.getData_inMatrix(posX, posY), null, 4))
    }
    randomSetPosition (objectReference) {
        let posX = toolController.randomInteger(0,this.worldsizeX)
        let posY = toolController.randomInteger(0,this.worldsizeY)
        let attempt = 0
        while (this.getData_inMatrix(posX, posY)) {
            if (attempt > 10) {
                console.log("strange error, there are so much attempt to place your charector")
                return null
            }
            posX = toolController.randomInteger(0,this.worldsizeX)
            posY = toolController.randomInteger(0,this.worldsizeY)
            attempt++
        }
        return [posX, posY]
    }

    ACTION_changeObjectPosition (objectReference,newX, newY) {
        if (this.getData_inMatrix(newX, newY)) {
            console.log("destination position has already allocated")
            return false
        }
        let oldX = objectReference.positionX
        let oldY = objectReference.positionY
        this.removePosition_inMatrix(oldX, oldY)
        objectReference.positionX = newX
        objectReference.positionY = newY
        this.setPosition_inMatrix(newX, newY, objectReference)
        return true
    }

    ACTION_removeObjectLink (persistedID) {
        console.log("Action remove object")
        let currentObjectLink = this.ObjectLinks.get(persistedID)
        if (currentObjectLink) {
            let objectpositionX = currentObjectLink.positionX
            let objectpositionY = currentObjectLink.positionY
            this.removePosition_inMatrix(objectpositionX, objectpositionY)
            this.ObjectLinks.delete(persistedID)
        } else {
        }
    }


    ////////////////////////////////////////////////////////////////////////
    /////////////////////////Background Process/////////////////////////////
    /////////////////////////Background Process/////////////////////////////
    /////////////////////////Background Process/////////////////////////////
    ////////////////////////////////////////////////////////////////////////


    async BACKGROUDPROCESS_INTERVAL_SaveAll () {

    }
    async BACKGROUDPROCESS_INTERVAL_SaveallObjectLinks () {

    }
    async BACKGROUDPROCESS_INTERVAL_SaveallMemberInfo () {

    }


    ////////////////////////////////////////////////////////////////////////
    //////////////////////////Realtime Monitor//////////////////////////////
    //////////////////////////Realtime Monitor//////////////////////////////
    //////////////////////////Realtime Monitor//////////////////////////////
    ////////////////////////////////////////////////////////////////////////

    monitorActiveMember (res) {
        let messages = "RemoteDesktopP2PObj Scheduler Active Member . Object Persisted ID : " + this.persistedID + "\n" +
            "----------------------------------------------------------------------------------\n"
        for (let i of this.activeMembers) {
            //console.log(i)
            messages += i[1].name + "\n"
        }
        res.send(messages)
    }


    MONITOR_World () {
        let messages = "**********************Session Monitoring************************\n"
        messages += "world ID : " + this.persistedID + "\n"

        messages += "Active Member : \n"
        for (let i of this.activeMembers) {
            let j = i[1].data
            let info = this.activeMembers_additionInfo.get(j.name)
            messages += `{ name :${j.name} posX :${info.positionX} posY:${info.positionY} standby:${j.standby} IP:${j.ipaddr} PORT:${j.port} } `
        }
        messages += "\n"
        messages += "Active Object Link : \n"

        for (let i of this.ObjectLinks) {
            let j = i[1]
            messages += `{ persistedID :${j.persistedID} owner_name :${j.owner_name} posX :${j.positionX} posY:${j.positionY} } `
        }
        messages += "\n"

        messages += "-------------------------------------------------------------------\n"

                for (let inY = 0; inY <= this.worldsizeY; inY++) {
                    for (let inX = 0; inX <= this.worldsizeX; inX++) {
                        //console.log("inX : " + inX + "  inY : " + inY)
                        let data = this.getData_inMatrix(inX, inY)
                        if (data){
                            //console.log(chalk.red("DEBUG found data in matrix"))
                            //console.log(CircularJSON.stringify(data, null, 4))
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






    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////Console Print///////////////////////////////
    ////////////////////////////Console Print///////////////////////////////
    ////////////////////////////Console Print///////////////////////////////
    ////////////////////////////////////////////////////////////////////////


    TEMPTEST_printactivemember () {
        console.log("++++++++++++++++++++++++++++++++++++++")
        console.log("++++++++++++++++++++++++++++++++++++++")
        console.log("++++++++++++++++++++++++++++++++++++++")
        console.log("++++++++++++++++++++++++++++++++++++++")
        console.log("++++++++++++++++++++++++++++++++++++++")

        for (let i of this.activeMembers) {
            //console.log(chalk.red(CircularJSON.stringify(i,null, 4)))
            let j = i[1].data
            console.log(chalk.yellow(j.persisted_id))
            console.log(chalk.yellow(j.name))
            console.log(chalk.yellow(j.ipaddr))
            console.log(chalk.yellow(j.port))
            console.log(chalk.yellow(j.active_at_world))
            console.log(chalk.yellow(j.active_at_objectID))
            console.log(chalk.yellow(j.objectowner))
            console.log()
        }
    }

    TEMPTEST_printobjectlink () {
        for (let i of this.ObjectLinks) {
            console.log(chalk.green(JSON.stringify(i, null, 4)))
            let j = i[1]
        }
    }



    ////////////////////////////////////////////////////////////////////////
    //////////////////////////Interval Process//////////////////////////////
    //////////////////////////Interval Process//////////////////////////////
    //////////////////////////Interval Process//////////////////////////////
    ////////////////////////////////////////////////////////////////////////


    REFRESH_ALL_toClient () {
        let lists = []
        let ALLIPPORT = []
        this.GETALL_ActiveMember_MessageTemplated(lists, ALLIPPORT)
        this.GETALL_ObjectLinks_MessageTemplated(lists)

        messagesController.messagesGlobalMethods.httpOutput_BROADCAST_POST(ALLIPPORT, messagesController.ClientPathTemplated.clientUserGateway,messagesController.messagesTemplates.BROADCAST_REFRESH_all(lists))

/*
        console.log('++++')
        console.log(chalk.yellow(JSON.stringify(ALLIPPORT, null, 4)))
        console.log('++++')
        console.log(chalk.yellow(JSON.stringify(lists, null, 4)))
        */
    }

    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////Client Action///////////////////////////////
    ////////////////////////////Client Action///////////////////////////////
    ////////////////////////////Client Action///////////////////////////////
    ////////////////////////////////////////////////////////////////////////

    ACTION_moveUser_position (name, newX, newY) {
        let currentUserInfo = this.activeMembers_additionInfo.get(name)
        let currentUserMainInfo = this.activeMembers.get(name)
        if (currentUserInfo && currentUserMainInfo) {
            if (this.ACTION_changeObjectPosition(currentUserInfo, newX, newY)) {
                let message = messagesController.messagesTemplates.BROADCAST_moveUserPosition(name, currentUserMainInfo.data.persistedID, currentUserMainInfo.data.standby, currentUserMainInfo.data.ipaddr, currentUserMainInfo.data.port, currentUserInfo.positionX, currentUserInfo.positionY)
                console.log(chalk.red("+++++++++++++++++++++++++++++++++++++++++++++++++"))
                console.log(chalk.red("+++++++++++++++++++++++++++++++++++++++++++++++++"))
                console.log(chalk.red("+++++++++++++++++++++++++++++++++++++++++++++++++"))
                console.log(chalk.red("+++++++++++++++++++++++++++++++++++++++++++++++++"))
                console.log(chalk.red("+++++++++++++++++++++++++++++++++++++++++++++++++"))
                console.log(chalk.red("+++++++++++++++++++++++++++++++++++++++++++++++++"))
                console.log(chalk.red("+++++++++++++++++++++++++++++++++++++++++++++++++"))
                console.log(chalk.red("+++++++++++++++++++++++++++++++++++++++++++++++++"))
                console.log(chalk.red("+++++++++++++++++++++++++++++++++++++++++++++++++"))

                messagesController.messagesGlobalMethods.httpOutput_BROADCAST_POST(this.GETALL_NETWORK_ADDRESS(), messagesController.ClientPathTemplated.clientUserGateway, message)
            } else {
                console.log("Your position can't changed due to some error")
            }
        } else {
            console.log("Strange error, user not found")
        }
    }



    ////////////////////////////////////////////////////////////////////////
    /////////////////////////////Uncatagorise///////////////////////////////
    /////////////////////////////Uncatagorise///////////////////////////////
    /////////////////////////////Uncatagorise///////////////////////////////
    ////////////////////////////////////////////////////////////////////////




    getObjectLinkReference (object_persistedID) {
        return this.ObjectLinks.get(object_persistedID)
    }
    async loadAllObjectLink () {
        let allobj = await WorldMethods.returnall_objectlink(this.persistedID)
        console.log(chalk.red(JSON.stringify(allobj, null, 4)))
        if (allobj) {
            for (let i of allobj.objectlinks) {
                //console.log(i)
                await this.addnewObjectLink(i._id, i.object_persisted_id, i.owner_persisted_id, i.owner_name, i.object_name, i.positionX, i.positionY)
            }
            console.log(this.ObjectLinks)
        } else {
            console.log("no object in this world")
        }

    }

    async saveAllMemberInfo () {
        for (let i of this.activeMembers) {
            //console.log("print i")
            //console.log(i[0])
            //console.log(i[1].positionX + " " + i[1].positionY)
            let info = this.activeMembers_additionInfo.get(i[1].data.name)

            await WorldMethods.changeMemberInfo(i[0], this.persistedID, {positionX:info.positionX, positionY:info.positionY})
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
        this.setPosition_inMatrix(positionX,positionY, newObjectLink)

    }

    async saveAllObjectLink () {
        for (let i of this.ObjectLinks) {
            await WorldMethods.saveUpdateObjectLink(this.persistedID, i._id, {positionX:i.positionX, positionY:i.positionY})
        }
    }



    removeObjectLink (persistedID, optional) {

    }

    removeActiveMember (username) {
        console.log('------------------------------------At Remote OBJ : Receive remove message ')
        console.log()
        let currentActiveMember = this.activeMembers_additionInfo.get(username)
        if (currentActiveMember) {
            let activeMemberpositionX = currentActiveMember.positionX
            let activeMemberpositionY = currentActiveMember.positionY
            console.log(chalk.red("Remove position"))
            this.removePosition_inMatrix(activeMemberpositionX, activeMemberpositionY)
            this.activeMembers.delete(username)
            this.changed = true
        } else {
            console.log("already not in this")
        }
    }
    forceChangeActiveMember () {
        this.changed = true
    }


    GETALL_ObjectLinks_MessageTemplated (previouslist) {
        for (let i of this.ObjectLinks) {
            let j = i[1]
            //console.log(chalk.yellow(JSON.stringify(i,null, 4)))
            let newlist = messagesController.messagesTemplates.CRAFT_one_object(j.subtype, j.persistedID, j.owner_name, j.positionX, j.positionY)
            previouslist.push(newlist)
        }
        //console.log(chalk.yellow(JSON.stringify(previouslist, null, 4)))
    }
    GETALL_ActiveMember_MessageTemplated (previouslist, optional_sentback_allIPPORT) {
        for (let i of this.activeMembers) {
            //console.log('==============')
            //console.log(i[1].data.name)
            let info = this.activeMembers_additionInfo.get(i[1].data.name)
            let maininfo = i[1].data
            let newlist = messagesController.messagesTemplates.CRAFT_one_user(maininfo.name, maininfo.persistedID, maininfo.standby, maininfo.ipaddr, maininfo.port, info.positionX, info.positionY)
            if (optional_sentback_allIPPORT) {
                optional_sentback_allIPPORT.push([maininfo.ipaddr,  maininfo.port])
            }
            previouslist.push(newlist)
        }
        //console.log(chalk.yellow(JSON.stringify(previouslist, null, 4)))
    }
    GETALL_NETWORK_ADDRESS () {
        let lists = []
        console.log(chalk.red("GETALL ADDRESS"))
        for (let i of this.activeMembers) {
            let maininfo = i[1].data
            lists.push([maininfo.ipaddr, maininfo.port])
        }
        //console.log(lists)
        return lists
    }

    async callObjectLink (persistedID, optional) {
        let currentObject = this.ObjectLinks.get(persistedID)
        if (currentObject) {
            if (optional.positionX != null) {
                if (currentObject.positionX === optional.positionX && currentObject.positionY === optional.positionY) {
                    console.log("position not changed")
                } else {
                    console.log("position changed")
                    this.ACTION_changeObjectPosition(currentObject, optional.positionX, optional.positionY)
                }
            }
            return true
        } else {
            console.log("object is not in memory")
            return false
        }
    }

    async callActiveMember (username, optional) {
        console.log(chalk.blue("// call world active member //"))

        const globalmemoryController = require(globalConfigs.mpath1.globalmemoryController)

        if (!optional) {
            console.log(chalk.red("require optional parameter"))
            return false
        }

        let currentMember = this.activeMembers.get(username)

        if (!currentMember) {
            if (!(await WorldMethods.isMember(username,this.persistedID))) {
                console.log(chalk.red("this user is not a member"))
                return false
            }
            console.log(chalk.red("DEBUG POINT 1"))
            let userpointer = await globalmemoryController.GlobalActiveUser.callUsersV2(username)

            if (!userpointer) {
                console.log("strange error : user not found in main database")
                return false
            }
            console.log(chalk.red("DEBUG POINT 2"))

            let loadinfo = await WorldMethods.loadMemberInfo(this.persistedID, username)
            console.log(chalk.red("DEBUG loadinfo : " + loadinfo))
            this.activeMembers.set(username, userpointer)
            if (!loadinfo) {
                console.log(chalk.red("DEBUG POINT 3"))

                console.log("user is newly member, adding user info")
                let randomPosition = this.randomSetPosition()
                console.log(`get random position x : ${randomPosition[0]} y : ${randomPosition[1]}`)
                let newmemberinfo = new this.memberinfo(randomPosition[0],randomPosition[1])
                this.activeMembers_additionInfo.set(username, newmemberinfo)
                await WorldMethods.changeMemberInfo(username, this.persistedID, {positionX: randomPosition[0],positionY: randomPosition[1]})
                this.setPosition_inMatrix(randomPosition[0],randomPosition[1], newmemberinfo)
            } else {
                console.log(chalk.red("DEBUG POINT 4"))

                let newmemberinfo = new this.memberinfo(loadinfo.positionX,loadinfo.positionY)
                this.activeMembers_additionInfo.set(username, newmemberinfo)
                if (!optional.bypassposition) {
                    console.log(chalk.red("DEBUG POINT 5"))

                    this.ACTION_changeObjectPosition( newmemberinfo,optional.positionX, optional.positionY)
                } else {
                    console.log(chalk.red("DEBUG POINT 6"))

                    this.setPosition_inMatrix(newmemberinfo.positionX, newmemberinfo.positionY, newmemberinfo)
                }
            }

            //this.setPosition_inMatrix(optional.positionX, optional.positionY, userpointer)
            //this.Debug_activeMembers.push(newuser)
            this.changed = true
        } else {
  /*
            console.log("user already active , getting info from : " + username)
            console.log("*******************************************")
            console.log("*******************************************")
            console.log("*******************************************")
            console.log("*******************************************")
            console.log("*******************************************")
            console.log("*******************************************")
*/
            console.log(chalk.red("DEBUG POINT 5"))

            let currentMemberInfo = this.activeMembers_additionInfo.get(username)
            if (currentMemberInfo) {
                console.log(chalk.red("DEBUG POINT 6"))

                console.log(chalk.red(JSON.stringify(currentMemberInfo, null, 4)))
                if (optional.positionX != null) {
                    if (currentMemberInfo.positionX === optional.positionX && currentMemberInfo.positionY === optional.positionY) {
                        //this.ACTION_changeObjectPosition(currentMember, optional.positionX, optional.positionY)
                        console.log("position not changed")
                    } else {
                        console.log("position changed")
                        //currentMemberInfo.positionX = optional.positionX
                        //currentMemberInfo.positionY = optional.positionY
                        this.ACTION_changeObjectPosition(currentMemberInfo, optional.positionX, optional.positionY)
                    }
                }
            } else {
                console.log("some strange error found")
                await WorldMethods.changeMemberInfo(username, this.persistedID, {positionX: optional.positionX, positionY: optional.positionY})
            }
        }
        return true
    }

    async INPUT_request_message (req) {
        if (req.body.WO_type) {
            switch (req.body.WO_type) {
                case "mov":
                    this.ACTION_moveUser_position(req.body.WO_name, req.body.WO_positionX, req.body.WO_positionY)
                    break
                case "signal":
                    break
            }
        } else {
            console.log("no messages world support")
        }
    }

/*

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
    */
/*
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
    */
}
class GlobalActiveWorldClass {
    constructor () {
        this.activeWorld = new HashArray('id')
        this.debugactiveWorld = []
    }
    async callWorld (persistedID) {
        console.log(chalk.blue("// call world //"))
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
                await OneWorld.loadAllObjectLink()
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

    static async loadMemberInfo (world_persistedID ,member_name) {
        const world_collection = mongotools.db.collection('worlds')
        let validation = true
        let info = null
        if (validation) {
            await new Promise(resolve => {
                world_collection.findOne(

                    {"_id": safeObjectId(world_persistedID), "memberinfo.member_name": member_name},

                    {"memberinfo.$":1},

                    (err, response) => {
                        if (err) {
                            console.log("error " + err)
                            validation = false
                        } else if (response) {
                            //console.log(response)
                            info = response
                        } else {
                            console.log("error response not found")
                            validation = false
                        }
                        return resolve()
                    }
                )
            })
            if (validation) {
                return info.memberinfo[0]
            } else {
                return null
            }
        }

    }
    static async changeMemberInfo (member_name, world_persistedID, optional) {
        const world_collection = mongotools.db.collection('worlds')
        const user_collection = mongotools.db.collection('users')
        let validation = true
        if (validation) {
            await new Promise(resolve => {
                world_collection.findOneAndUpdate(
                    {_id: safeObjectId(world_persistedID), "memberinfo.member_name": member_name},

                    {$set: {"memberinfo.$.positionX": optional.positionX, "memberinfo.$.positionY": optional.positionY}},

                    {projection: {_id:1}},

                    (err, response) => {
                        if (err) {
                            console.log("Error " + err)
                            validation = false
                        } else if (response) {
                            console.log(response.value)
                            if (response.value) {
                                console.log("validation goes false")
                                validation = false
                            }
                        } else {
                            console.log("error response not found")
                            validation = false
                        }
                        return resolve()
                    }
                )
            })
        }

        if (validation) {
            console.log("work")
            await new Promise(resolve => {
                world_collection.updateOne(

                    {_id: safeObjectId(world_persistedID)},

                    {$push :
                            {
                                "memberinfo": {
                                    member_name: member_name,
                                    positionX: optional.positionX,
                                    positionY: optional.positionY
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

    static async removeMemberInfo (member_name, world_persistedID, optional) {

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
        //please fix bug when world have no any object links
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