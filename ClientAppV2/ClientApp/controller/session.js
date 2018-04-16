/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//////////////////////////Requirement Section////////////////////////
/////////////////////////////////////////////////////////////////////
///////**//This code require javascript version 6 or newer//**///////
////////////////////////miscellaneous////////////////////////////////

const chalk = require('chalk')
const ndarray = require('ndarray')
const CircularJSON = require('circular-json')
const fs = require('fs')
/////////////////////////////////////////////////////////////////////
const MonitorSocketChannal_45000 = require('socket.io-client')('http://localhost:45000/monitor')
//port 45000 Monitor Socket
MonitorSocketChannal_45000.on('connect', () => {
    console.log("connect to monitor")
});
MonitorSocketChannal_45000.on('terminal',(msg)=>{
    console.log(msg)
});
MonitorSocketChannal_45000.on('disconnect', function(){});
MonitorSocketChannal_45000.on('connect_error', (err)=>{
    console.log(chalk.red(err))
})
/////////////////////////////////////////////////////////////////////


//const MatrixHash = require('matrix-hash') BUG
////////////////////////////From Configs/////////////////////////////

const globalConfigs = require('../config/GlobalConfigs')
const socketIO = require(globalConfigs.mpath1.socketIOconfig).socketIO

///////////////////////From Other Controllers////////////////////////

const toolsController = require(globalConfigs.mpath1.toolsController)
//const messagesController = require(globalConfigs.mpath1.messagesController)
let streamController = null
setTimeout(
    () => {
        //console.log("require completed")
        streamController = require(globalConfigs.mpath1.streamController)
    },1000
)

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////


//==================================================================================================
//==================================================================================================
//==================================================================================================

class aciveMember_Class {
    constructor (name, persistedID, optionals) {
        this.maintype = "member"
        this.name = name
        this.persistedID = persistedID
        this.positionX = 0
        this.positionY = 0
        this.IP = ""
        this.PORT = ""
        this.standby = false

        this.staticfacebuffer = null
        //console.log("show constructor optionals " + JSON.stringify(optionals, null, 4))
        if (optionals) {
            if (optionals.positionX) {
                this.positionX = optionals.positionX
            }
            if (optionals.positionY) {
                this.positionY = optionals.positionY
            }
            if (optionals.IP) {
                this.IP = optionals.IP
            }
            if (optionals.PORT) {
                this.PORT = optionals.PORT
            }
        }
        this.SET_staticFaceFromServer()
    }
    changePosition (newX, newY) {
        this.positionX = newX
        this.positionY = newY
    }

    changeIPPORT (newIP, newPORT) {
        this.IP = newIP
        this.PORT = newPORT
    }

    changeStandbyMode (TF) {
        if (TF === true || TF === false) {
            this.standby = TF
        } else {
            console.log("TF Error")
        }
    }

    SET_staticFace (faceimagebuffer) {
        this.staticfacebuffer = faceimagebuffer
    }
    async SET_staticFaceFromServer () {
        const messagesController = require(globalConfigs.mpath1.messagesController)
        let data = await messagesController.messagesGlobalMethods.httpOutput_POST_SERVER_V2withASYNC('getAvatar', {
            username: this.name
        })
        if (!data) {
            return false
        }
        this.SET_staticFace(data)
    }
}
class objectLink_Class {
    constructor (persistedID, owner_name, type, optionals, owner_ID) {
        this.maintype = "object"
        this.persistedID = persistedID
        this.owner_name = owner_name
        this.owner_ID = owner_ID
        this.type = ""
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
    changeType (newType) {
        this.type = newType
    }
}




class sessionObjectMemory_Class {
    constructor () {
        this.objectPointer = new Map()
    }
    ADD_newObjectMemory (id_or_name,ObjectMemory_Pointer) {
        if (this.objectPointer.has(id_or_name)) {
            console.log("this id or name already allocate memory")
        } else {
            this.objectPointer.set(id_or_name, ObjectMemory_Pointer)
            console.log("create new in memory completed")
        }
    }
    REMOVE_ObjectMemory (id_or_name) {
        if (this.objectPointer.delete(id_or_name)) {
            console.log("delete completed")
        } else {
            console.log("object memory not found")
        }
    }
    GET_ObjectMemoryReference (id_or_name) {
        return this.objectPointer.get(id_or_name)
    }
}

class session_Class {
    constructor () {
        this.active_at_world_persistedID = ""
        this.active_at_object_persistedID = ""

        this.active_at_world_name = "no-name"
        //this.active_at_object_objectowner = ""
        //this.active_at_object_type = ""
        this.object_owner_name = ""
        this.object_owner_ID = ""
        this.object_type = ""

        this.currentUser_persistedID = "" //globalConfigs.ClientInfo.currentUser_persistedID
        this.currentUser_name = ""//globalConfigs.ClientInfo.currentUser_name
        this.currentUser_password = ""//"abcd"
        this.currentUser_IP = ""//globalConfigs.ClientInfo.clientIP
        this.currentUser_PORT = ""//globalConfigs.ClientInfo.clientPORT


        this.remoteObjectID = ""

        this.logined = false


        //this.worldmatrix = new MatrixHash(2)
        this.worldmatrix = new toolsController.HashMatrix()

        this.activeMember = new Map()
        this.objectLink = new Map()

        this.heartbeatScheduler = null
        this.heartbeatIntervalTime = 5000 //ms

        this.connection_to_server_Heartbeat = null
        this.connection_to_server_heartbeat_Interval_time = 10000 //ms
        this.connection_to_server_heartbeat_score = 0
        this.connection_to_server_heartbeat_max_score = 2
        this.connection_to_server_active = false


        this.WorldPage = ""
        this.WorldPage_connection_heartbeat_Scheduler = null
        this.WorldPage_connection_heartbeat_Interval_time = 5000 //ms
        this.WorldPage_connection_heartbeat_score = 0
        this.WorldPage_connection_heartbeat_max_score = 2
        this.WorldPage_connection_Active = false


        this.remoteobjectPage = ""
        this.remoteobjectPage_connection_heartbeat_Scheduler = null
        this.remoteobjectPage_connection_heartbeat_Interval_time = 5000 //ms
        this.remoteobjectPage_connection_heartbeat_score = 0
        this.remoteobjectPage_connection_heartbeat_max_score = 2
        this.remoteobjectPage_connection_Active = false



        this.currentMessageTransactionGet = 0
        this.currentMessageTransactionSent = 0

        this.worldsizeX = 40
        this.worldsizeY = 15

        this.ALLTASK = []

        this.first_refresh = true

        this.WAIT_FOR_FIRST_REFRESH = null

/*
        this.waitlogin1 = setInterval(
            () => {
                if (this.logined === true) {
                    clearInterval(this.waitlogin1)
                    this.waitlogin1 = null

                            console.log(chalk.blue("starting login to Server"))
                            const messagesController = require(globalConfigs.mpath1.messagesController)
                            this.WAIT_FOR_FIRST_REFRESH = setInterval(
                                ()=>{

                                    if (this.first_refresh === true) {
                                        clearInterval(this.WAIT_FOR_FIRST_REFRESH)
                                        this.WAIT_FOR_FIRST_REFRESH = null
                                        return this.HEARTBEAT_signal_start()
                                    }
                                    console.log(chalk.yellow('senting login heartbeat'))
                                    messagesController.messagesGlobalMethods.httpOutput_POST_SERVER(globalConfigs.specificServerPath.user_messages_serverpath,messagesController.messagesTemplates.signalFirstHeartBeat(this.currentUser_name, this.active_at_world_persistedID, this.active_at_object_persistedID, this.currentUser_IP, this.currentUser_PORT))

                                },1500
                            )

                } else {
                    console.log('1* WAITING FOR LOGIN')
                }
            },1000
        )
*/



        //this.HEARTBEAT_signal_start()


        this.globalObjectMemory = new sessionObjectMemory_Class()

        this.SocketIO_Listener_RemoteMonitor = null


        this.waitlogin2 = setInterval(
            () => {
                if (this.logined === true) {
                    clearInterval(this.waitlogin2)
                    this.waitlogin2 = null

                            if (socketIO.io == null) {
                                console.log(chalk.red("Please set more time to start listener"))
                            } else {
                                let IO = socketIO.io
                                this.SocketIO_Listener_RemoteMonitor = IO
                                    .of('/remoteMon')
                                    .on('connection', (socket) => {
                                        console.log("peer connect to chat")
                                        //console.log(JSON.stringify(socket.handshake.headers, null, 4))
                                        socket.on('disconnect', () => {
                                            console.log("user disconnect")
                                        })
                                        socket.on('pageheartbeat', (message) => {
                                            //console.log(chalk.green("Signal.."))
                                            this.PAGE_HEARTBEAT_MANAGER(message)
                                        })
                                    })
                                console.log(chalk.green("Started listener"))
                            }

                } else {
                    console.log('2* WAITING FOR LOGIN')
                }
            },1000
        )

        this.remotestreaming = null
        this.facestreaming = null

        setTimeout(
            () => {
                console.log("remote streaming module start")
                this.remotestreaming = new streamController.DesktopRecorder_Class(this)
                console.log("face streaming module start")
                this.facestreaming = new streamController.CameraRecorder_Class(this)
            }, 1500
        )


/*
        this.waitlogin3 = setInterval(
            () => {
                if (this.logined === true) {
                    clearInterval(this.waitlogin3)
                    this.waitlogin3 = null

                            console.log("remote streaming module start")
                            this.remotestreaming = new streamController.DesktopRecorder_Class(this)
                            console.log("face streaming module start")
                            this.facestreaming = new streamController.CameraRecorder_Class(this)

                } else {
                    console.log('3* WAITING FOR LOGIN')
                }
            },1000
        )
        */

        this.SCHEDULER_getFaces = null
        this.INTERVALTIME_getFaces = 100 //ms

        this.SCHEDULER_getObject = null
        this.INTERVALTIME_getObject = 2000 //ms

        this.SCHEDULER_getFarUsers = null
        this.INTERVALTIME_getFarUsers = 1000 //ms

        this.SCHEDULER_WORLDUI_STATICDATA = null
        this.INTERVALTIME_WORLDUI_STATICDATA = 5000 //ms

        this.SCHEDULER_getNearbyUser = null
        this.INTERVALTIME_getNearbyUser = 2000 //msec
        this.PREVALUE_getNearbyUser_BoundLengthX = 2
        this.PREVALUE_getNearbyUser_BoundLengthY = 2

        this.CurrentNearbyUserLists = []
        this.CurrentNearbyUserLists_HASH = new Map()

        this.CONTROL_START_GETNEARBY_SCHEDULER()

        this.usersMovement = false

        //this is hot section, due to low time dev.

        this.STATICRemoteObjectPic = fs.readFileSync(globalConfigs.testpath1.camtest+"RemoteObject.jpg")

        //

    }

    HEARTBEAT_signal_start () {
        const messagesController = require(globalConfigs.mpath1.messagesController)
        if (this.heartbeatScheduler) {
            console.log("Heartbeat signal already started")
        } else {
            console.log("Starting heartbeat")

            this.heartbeatScheduler = setInterval(
                async () => {
                    let datareturn = await messagesController.messagesGlobalMethods.httpOutput_POST_SERVER_V2withASYNC(globalConfigs.specificServerPath.user_messages_serverpath,messagesController.messagesTemplates.signalHeartBeat(this.currentUser_name, this.active_at_world_persistedID, this.active_at_object_persistedID, this.currentUser_IP, this.currentUser_PORT))
                    console.log(chalk.red("check data return : " + JSON.stringify(datareturn, null, 4)))
                    if (datareturn) {
                        if (datareturn.message === "connected") {
                            this.INTERNALCONTROL_SIGNAL_connection_to_server_Heartbeat()
                        }
                    }
                    console.log("Sent heartbeat")
                }
                , this.heartbeatIntervalTime
            )
        }
    }

    HEARTBEAT_signal_stop () {
        if (this.heartbeatScheduler) {
            clearInterval(this.heartbeatScheduler)
            this.heartbeatScheduler = null
        }
    }

    SET_CurrentUSER (name, persistedID, password) {
        this.currentUser_name = name
        this.currentUser_persistedID = persistedID
        this.currentUser_password = password
        this.remotestreaming.SET_UserInfo(persistedID, name)
        console.log(chalk.cyanBright(`SET CURRENT USER TO ID : ${persistedID} name : ${name}`))
    }
    SET_CurrentWorld (persistedID) {
        if (this.logined === false) {
            console.log(chalk.red("can't set world, due to not login yet"))
            return false
        }
        if (this.first_refresh === false) {
            console.log(chalk.red("can't set world, due to refresh operation does not completed"))
            return false
        }

        this.active_at_world_persistedID = persistedID
        this.active_at_object_persistedID = ""
        this.first_refresh = false
        this.AUTOSET_REMOTE_OBJECTID()

        console.log(chalk.cyanBright("SET CURRENT WORLD TO ID : " +  persistedID))


        console.log(chalk.blue("starting login to Server"))
        const messagesController = require(globalConfigs.mpath1.messagesController)
        this.WAIT_FOR_FIRST_REFRESH = setInterval(
            ()=>{

                if (this.first_refresh === true) {
                    clearInterval(this.WAIT_FOR_FIRST_REFRESH)
                    this.WAIT_FOR_FIRST_REFRESH = null
                    return this.HEARTBEAT_signal_start()
                }
                console.log(chalk.yellow('senting login heartbeat'))
                messagesController.messagesGlobalMethods.httpOutput_POST_SERVER(globalConfigs.specificServerPath.user_messages_serverpath,messagesController.messagesTemplates.signalFirstHeartBeat(this.currentUser_name, this.active_at_world_persistedID, this.active_at_object_persistedID, this.currentUser_IP, this.currentUser_PORT))

            },1500
        )


    }
    SET_CurrentObjectLink (persistedID, ownername, objecttype, ownerID) {
        if (this.logined === false) {
            console.log(chalk.red("can't set world, due to not login yet"))
            return false
        }
        if (this.first_refresh === false || this.active_at_world_persistedID === "") {
            console.log(chalk.red('this set object can do only after first refresh'))
        } else {
            this.active_at_object_persistedID = persistedID
            this.object_owner_name = ownername
            this.object_owner_ID = ownerID
            this.object_type = objecttype
            console.log(chalk.cyanBright("SET CURRENT OBJECT TO ID : " +  persistedID))
            console.log(chalk.cyanBright(`SET CURRENT OBJECT TO ID : ${persistedID}  WITH OWNER NAME : ${ownername}  OWNER ID : ${objecttype} TYPE : ${ownerID} `))
        }
    }
    SET_IP_PORT (ip, port) {
        this.currentUser_IP = ip
        this.currentUser_PORT = port
    }
    SET_REMOTE_OBJECTID (persistedID) {
        this.remoteObjectID = persistedID
        this.remotestreaming.SET_remoteObjectID(persistedID)
        console.log(chalk.cyanBright(`SET REMOTE OBJECT TO ID : ${persistedID}`))

    }
    async AUTOSET_REMOTE_OBJECTID () {
        const messagesController = require(globalConfigs.mpath1.messagesController)
        let ID = await messagesController.messagesGlobalMethods.httpOutput_POST_SERVER_V2withASYNC(messagesController.ClientPathTempleted.requestRemoteObjectID, {username: this.currentUser_name, worldID: this.active_at_world_persistedID})
        await messagesController.messagesGlobalMethods.httpOutput_POST_SERVER_V2withASYNC("clientIPTest", {})
        if (!ID)
            return false
        if (!ID.objectID)
            return false

        this.remoteObjectID = ID.objectID
        this.remotestreaming.SET_remoteObjectID(ID.objectID)
    }

    GET_activeObjectID () {
        return this.active_at_object_persistedID
    }


    INTERNALCONTROL_START_connection_to_server_Heartbeat () {
        this.connection_to_server_active = true
        this.connection_to_server_Heartbeat = setInterval(
            () => {
                this.connection_to_server_heartbeat_score--
                if (this.connection_to_server_heartbeat_score <= 0) {
                    clearInterval(this.connection_to_server_Heartbeat)
                    this.connection_to_server_Heartbeat = null
                    this.connection_to_server_active = false

                    this.remotestreaming.STOP_RECORD()
                    this.facestreaming.STOP_RECORD()
                }
            }, this.connection_to_server_heartbeat_Interval_time
        )
    }
    INTERNALCONTROL_SIGNAL_connection_to_server_Heartbeat () {
        this.connection_to_server_heartbeat_score = this.connection_to_server_heartbeat_max_score
        if (this.connection_to_server_active === false) {
            this.INTERNALCONTROL_START_connection_to_server_Heartbeat()
        }
    }


    getMatrixInfo () {
        this.worldmatrix.getInfo()
    }
    printMatrix (row, colume) {
        let message = ""
        for (let incolume = 0; incolume <= colume;incolume++) {
            for (let inrow = 0; inrow <= row; inrow++) {
                //console.log("incolume : " + incolume + "  inrow : " + inrow)
                let data = this.getData_inMatrix(inrow, incolume)
                if (data){
                    message += data + " "
                } else {
                    message += "* "
                }
            }
            message += "\n"
        }
        console.log(message)
    }


    setPosition_inMatrix (posX, posY, objectReference) {
        //console.log("show object reference " + objectReference)
        this.worldmatrix.set(posX, posY, objectReference)
        //console.log("show element " + this.worldmatrix.get([posX, posY]))
    }
    getData_inMatrix (posX, posY) {
        return this.worldmatrix.get(posX, posY)
    }
    removePosition_inMatrix (posX, posY) {
        //console.log("remove position occured at posX " + posX + " posY " + posY)
        //console.log("before remove : " + JSON.stringify(this.getData_inMatrix(posX, posY), null, 4))
        this.worldmatrix.set(posX, posY, null)
        //console.log("after remove : " + JSON.stringify(this.getData_inMatrix(posX, posY), null, 4))

    }



    ACTIVE_SETLOGINED () {
        this.logined = true
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
    ACTION_refresh () {
        this.first_refresh = true
        this.activeMember = new Map()
        this.objectLink = new Map()
        this.worldmatrix = new toolsController.HashMatrix()
    }

    GET_REMOTEDESKTOP_frame (object_persistedID) {
        if (this.active_at_object_persistedID !== object_persistedID) {
            console.log("false receive remote desktop task")
            return false
        }
        let currentObject = this.CALL_RemoteObject(object_persistedID, ownerID, ownerName)
        currentObject = currentObject.GET_frameBufferController()
        return currentObject.GET_frame()
    }

    CHECK_RequestRemoteTask (name, ID, objectID, objectownername, objectownerID) {
        let validation = true
        if (String(this.currentUser_name) !== name) {
            console.log(chalk.red("request remote task client name not true, IGNORE"))
            console.log(chalk.yellow("currentUser_name " + this.currentUser_name))
            validation = false
        }
        if (String(this.currentUser_persistedID) !== ID) {
            console.log(chalk.red("request remote task client ID not true, IGNORE"))
            console.log(chalk.yellow("currentUser_ID " + this.currentUser_persistedID))

            validation = false
        }
        if (String(this.active_at_object_persistedID) !== objectID) {
            console.log(chalk.red("request remote task activeobjectID not true, IGNORE"))
            console.log(chalk.yellow("our object_ID " + this.active_at_object_persistedID))

            validation = false
        }
        if (String(this.object_owner_name) !== objectownername) {
            console.log(chalk.red("request remote task object ownername not true, IGNORE"))
            console.log(chalk.yellow("our objectownername " + this.object_owner_name))

            validation = false
        }
        return validation
    }

    CHECK_RequestRemoteUpdateFrame (name, objectID, ownerID) {
        let validation = true
        if (String(this.currentUser_name) !== String(name)) {
            console.log(chalk.red("send destination name not true, IGNORE"))
            console.log(chalk.yellow(`current user name : ${this.currentUser_name} dest name : ${name}`))
            validation = false
        }
        if (String(this.active_at_object_persistedID) !== objectID) {
            console.log(chalk.red("this remote object not active, IGNORE"))
            console.log(chalk.yellow("object_ID " + this.active_at_object_persistedID))
            validation = false
        }
        if (String(this.object_owner_ID) !== ownerID) {
            console.log(chalk.red("this remote object not active, IGNORE"))
            console.log(chalk.yellow("objectownername " + this.object_owner_name))
            validation = false
        }
        return validation
    }

    CHECK_RequestFaceFrameUpdate (worldID, username) {
        let validation = true
        //console.log(`recieve world ID : ${worldID} client worldID : ${this.active_at_world_persistedID}`)
        if (String(this.active_at_world_persistedID) !== String(worldID)) {
            console.log(chalk.red("world ID not true"))
            validation = false
        }
        if (String(this.currentUser_name) !== String(username)) {
            console.log(chalk.red("client name not true"))
            validation = false
        }
        return validation
    }


    CALL_RemoteObject (object_persistedID, ownerID, ownerName) {
        let  getObject = this.globalObjectMemory.GET_ObjectMemoryReference(object_persistedID)
        if (getObject) {
            console.log("found remote object")
            return getObject
        } else {
            console.log("not found remote object, so create new remote object")
            let newObject = new streamController.OneObjectRemoteDesktop_Class(object_persistedID, ownerID, ownerName, this)
            this.globalObjectMemory.ADD_newObjectMemory(object_persistedID, newObject)
            return newObject
        }
    }

    CALL_FaceObject (username) {
        let getObject = this.globalObjectMemory.GET_ObjectMemoryReference(username)
        if (getObject) {
            //console.log("found face object")
            return getObject
        } else {
            console.log("not found face object, so create new face object")
            let newObject = new streamController.OneFaceImagesStore_Class(username, this)
            this.globalObjectMemory.ADD_newObjectMemory(username, newObject)
            return newObject
        }
    }

    CONTROL_CreateRemoteObject (posX, posY) {
        const messagesController = require(globalConfigs.mpath1.messagesController)
        messagesController.messagesGlobalMethods.httpOutput_POST_SERVER_V2withASYNC(
            messagesController.ClientPathTempleted.createRemoteObject
            ,messagesController.messagesTemplates.REQUEST_CREATE_REMOTEOBJECT(this.currentUser_name, posX, posY)
        )
    }

    GETREF_RemoteObject (object_persistedID) {
        let  getObject = this.globalObjectMemory.GET_ObjectMemoryReference(object_persistedID)
        if (getObject) {
            console.log("found remote object")
            return getObject
        } else {
            console.log("not found remote object, so create new remote object")
            return null
        }
    }

    CONTROL_MoveToPosition (posX, posY) {
        const messagesController = require(globalConfigs.mpath1.messagesController)

        let ownuser = this.getOwnMember()
        if (ownuser) {
            if (this.ACTION_changeObjectPosition(ownuser, posX, posY)) {
                messagesController.messagesGlobalMethods.httpOutput_POST_SERVER(globalConfigs.specificServerPath.user_messages_serverpath, messagesController.messagesTemplates.moveUserPosition(ownuser,posX, posY, this.active_at_world_persistedID))
            } else {
                console.log("move error")
            }
        } else {
            console.log("your user not found in memory or database")
        }
    }
    CONTROL_ChangeActiveWorld (newActiveWorld_persistedID) {
        const messagesController = require(globalConfigs.mpath1.messagesController)

        this.active_at_world_persistedID = newActiveWorld_persistedID
        messagesController.messagesGlobalMethods.httpOutput_POST_SERVER(globalConfigs.specificServerPath.user_messages_serverpath, messagesController.messagesTemplates.changeActiveWorld(newActiveWorld_persistedID, this.currentUser_name))
    }
    CONTROL_ChangeActiveObject (newObject_persistedID) {
        const messagesController = require(globalConfigs.mpath1.messagesController)

        this.active_at_object_persistedID = newObject_persistedID
        messagesController.messagesGlobalMethods.httpOutput_POST_SERVER(globalConfigs.specificServerPath.user_messages_serverpath, messagesController.messagesTemplates.changeActiveObject(newObject_persistedID, this.currentUser_name))
    }

    CONTROL_START_BroadcastScreen () {
        let currentObject = globalSession.CALL_RemoteObject(this.remoteObjectID, this.currentUser_persistedID, this.currentUser_name)
        this.remotestreaming.START_RECORD(currentObject)
    }
    CONTROL_STOP_BroadcastScreen () {
        this.remotestreaming.STOP_RECORD()
    }

    CONTROL_START_GETNEARBY_SCHEDULER () {
        if (this.SCHEDULER_getNearbyUser) {
            console.log("getnearby user already started")
        } else {
            console.log('Starting getnearbyuser scheduler')
            this.SCHEDULER_getNearbyUser = setInterval(
                () => {
                    let nearbyUsers = []
                    let boundlengthX = this.PREVALUE_getNearbyUser_BoundLengthX
                    let boundlengthY = this.PREVALUE_getNearbyUser_BoundLengthY
                    let currentUser = this.activeMember.get(this.currentUser_name)
                    if (!currentUser) {
                        console.log("user not loaded yet")
                        return false
                    }
                    /*
                    let users_not_near = new Map()
                    for (let i of this.activeMember) {
                        let j = i[1]
                        users_not_near.set(j.name, j)
                    }
                    */
                    this.CurrentNearbyUserLists_HASH = new Map()
                    let startboundX = Number(currentUser.positionX) - boundlengthX
                    let endboundX = Number(currentUser.positionX) + boundlengthX
                    let startboundY = Number(currentUser.positionY) - boundlengthY
                    let endboundY = Number(currentUser.positionY) + boundlengthY
                    console.log(`start x ${startboundX} end x ${endboundX} start y ${startboundY} end y ${endboundY}`)

                    for (let x = startboundX; x < endboundX; x++) {
                        for (let y = startboundY; y < endboundY; y++) {
                            //console.log(`at position x ${x} y ${y}`)
                            let data = this.getData_inMatrix(x,y)
                            if (data) {
                                if (data.maintype = "member") {
                                    //console.log(JSON.stringify(data, null, 4))
                                    nearbyUsers.push(data)
                                    this.CurrentNearbyUserLists_HASH.set(data.name, data)
                                }
                            }
                        }
                    }
                    //console.log(chalk.yellow("print array of users"))
                    //console.log(nearbyUsers)
                    this.CurrentNearbyUserLists = nearbyUsers
                }, this.INTERVALTIME_getNearbyUser
            )
        }
    }
    CONTROL_STOP_GETNEARBY_SCHEDULER () {
        if (this.SCHEDULER_getNearbyUser) {
            clearInterval(this.SCHEDULER_getNearbyUser)
            this.SCHEDULER_getNearbyUser = null
            console.log('SCHEDULER_getNearbyUser stopped')
        } else {
            console.log('SCHEDULER_getNearbyUser already stopped')
        }
    }


    FORUI_getallactivemember() {
        let lists = []
        for (let i of this.activeMember) {
            lists.push(i)
        }
        return lists
    }
    FORUI_getallobjectlinks () {
        let lists = []
        for (let i of this.objectLink) {
            lists.push(i)
        }
        return lists
    }
    FORUI_getinfo_fromPosition (posX, posY) {
        return this.getData_inMatrix(posX, posY)
    }

    getOwnMember () {
        console.log("getting : " + this.currentUser_name)
        return this.activeMember.get(this.currentUser_name)
    }


    PRINT_activeMembers () {
        let messages = ""
        for (let i of this.activeMember) {
            messages += i[1].name + " "
        }
        console.log("ACTIVE MEMBER")
        console.log(messages)
    }
    PRINT_objectLink () {
        let messages = ""
        for (let i of this.objectLink) {
            messages += i[1].persistedID + " "
        }
        console.log("ACTIVE Object Links")
        console.log(messages)
    }
    PRINT_info () {
        console.log("****Print Session Info****")
        console.log("Active at world ID : " + this.active_at_object_persistedID)
        console.log("Active at object ID : " + this.active_at_object_persistedID + " owner name : " + this.object_owner_name)

        console.log("User information || ID : " + this.currentUser_persistedID + " name : " + this.currentUser_name + " password " + this.currentUser_password)
        console.log("                 || PORT : " + this.currentUser_IP + " PORT : " + this.currentUser_PORT)

        //this.PRINT_activeMembers()
        //this.PRINT_objectLink()
    }




    MONITOR_Session () {
        let messages = "**********************Session Monitoring************************\n"
        messages += "Active at world ID : " + this.active_at_world_persistedID + "  connection status : " + this.connection_to_server_active + "  with score : " + this.connection_to_server_heartbeat_score + "\n"
        messages += "Active at object ID : " + this.active_at_object_persistedID + " owner name : " + this.object_owner_name + "\n"
        messages += "User information || ID : " + this.currentUser_persistedID + " name : " + this.currentUser_name + " password " + this.currentUser_password + "\n"

        messages += "Active Member : \n"
        for (let i of this.activeMember) {
            let j = i[1]
            messages += `{ name :${j.name} posX :${j.positionX} posY:${j.positionY} standby:${j.standby} IP:${j.IP} PORT:${j.PORT} } `
        }
        messages += "\n"
        messages += "Active Object Link : \n"

        for (let i of this.objectLink) {
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
                    /*
                    console.log("data" + JSON.stringify(data, null, 4))
                    messages += "U "*/

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

    TEST_MONITOR_SOCKETIO (newbuffer) {
        this.SocketIO_Listener_RemoteMonitor.volatile.emit('remoteinfo', {
            message: "welcome",
            buffer: newbuffer
        })
    }

    MONITOR_REMOTEFRAME_SOCKETIO (newbuffer, frame, timestamp) {
        this.SocketIO_Listener_RemoteMonitor.volatile.emit('remote_debug', {
            message: "welcome",
            frame: frame,
            timestamp: timestamp,
            buffer: newbuffer
        })
    }

    MONITOR_FACESTREAMING_SOCKETIO (faceframebuffer) {
        this.SocketIO_Listener_RemoteMonitor.volatile.emit('face_debug', {
            type: "facedebug",
            buffer: faceframebuffer
        })
    }

    SENT_FACESFRAME_SOCKETIO (arrayofusersfacebuffer) {
        this.SocketIO_Listener_RemoteMonitor.volatile.emit('faces', {
            type: "faces",
            users: arrayofusersfacebuffer
        })
    }
    SENT_OBJECTSFRAME_SOCKETIO (arrayofobjectsbuffer) {
        this.SocketIO_Listener_RemoteMonitor.volatile.emit('objects', {
            type: "objects",
            objects: arrayofobjectsbuffer
        })
    }
    SENT_FARUSERSFRAME_SOCKETIO (arrayofusersbuffer) {
        this.SocketIO_Listener_RemoteMonitor.volatile.emit('farusers', {
            type: "farusers",
            users: arrayofusersbuffer
        })
    }
    SENT_STATICWORLDUI_SOCKETIO (data) {
        this.SocketIO_Listener_RemoteMonitor.emit('staticdata', {
            type: "staticdata",
            data: data
        })
    }

    /////////////////////////////Global Page////////////////////////////
    /////////////////////////////Global Page////////////////////////////
    /////////////////////////////Global Page////////////////////////////
    /////////////////////////////Global Page////////////////////////////
    /////////////////////////////Global Page////////////////////////////


    PAGE_HEARTBEAT_MANAGER (message) {
        if (!message) {
            console.log(chalk.red("no message"))
            return false
        }
        if (!(message.type)) {
            console.log(chalk.red("message not support"))
            return false
        }
        switch (message.type) {
            case "signalH": {

                switch (message.page) {
                    case "world":
                        this.SIGNAL_WorldPageHeartbeat()
                        break
                    default:
                        console.log(chalk.yellow("page name not in category"))
                        break
                }
                break
            }

            default:
                console.log(chalk.yellow("type not in category"))
                break
        }

    }




    /////////////////////////////World Page////////////////////////////
    /////////////////////////////World Page////////////////////////////
    /////////////////////////////World Page////////////////////////////
    /////////////////////////////World Page////////////////////////////
    /////////////////////////////World Page////////////////////////////

    SIGNAL_WorldPageHeartbeat () {
        this.WorldPage_connection_heartbeat_score = this.WorldPage_connection_heartbeat_max_score
        if (this.WorldPage_connection_Active === false) {
            this.WorldPage_connection_Active = true
            this.FORUI_START_RENDER_WORLD()
            this.WorldPage_connection_heartbeat_Scheduler = setInterval(
                () => {
                    this.WorldPage_connection_heartbeat_score--
                    if (this.WorldPage_connection_heartbeat_score <= 0) {
                        clearInterval(this.WorldPage_connection_heartbeat_Scheduler)
                        this.WorldPage_connection_heartbeat_Scheduler = null
                        this.FORUI_STOP_RENDER_WORLD()
                        this.WorldPage_connection_Active = false

                    }
                }, this.WorldPage_connection_heartbeat_Interval_time
            )
        }
    }

    FORUI_START_RENDER_WORLD () {
        console.log(chalk.green("START RENDER WORLD"))
        this.FORUI_START_GETFACE()
        this.FORUI_START_GETOBJECTS()
        this.FORUI_START_GETFARUSERS()
        this.FORUI_START_WORLDUI_STATICDATA()
    }
    FORUI_STOP_RENDER_WORLD () {
        console.log(chalk.green("STOP RENDER WORLD"))
        this.FORUI_STOP_GETFACE()
        this.FORUI_STOP_GETOBJECTS()
        this.FORUI_STOP_GETFARUSERS()
        this.FORUI_STOP_WORLDUI_STATICDATA()
    }


    FORUI_START_GETFACE () {
        if (this.SCHEDULER_getFaces) {
            console.log("getFaces scheduler already start")
        } else {
            console.log("starting getFaces")
            this.SCHEDULER_getFaces = setInterval(
                () => {
                    let arrayofusersface = []

                    for (let i of this.CurrentNearbyUserLists) {
                        //i = i[1]
                        let framebuffer = this.CALL_FaceObject(i.name).GET_frame()
                        if (framebuffer) {
                            arrayofusersface.push({
                                //type: "member",
                                name: i.name,
                                positionX: i.positionX,
                                positionY: i.positionY,
                                persistedID: null,
                                framebuffer: framebuffer,
                                info: ""
                            })
                        } else {
                            //console.log("face not update too long")
                            arrayofusersface.push({
                                //type: "member",
                                name: i.name,
                                positionX: i.positionX,
                                positionY: i.positionY,
                                persistedID: null,
                                framebuffer: i.staticfacebuffer,
                                info: ""
                            })
                        }
                    }
                    //console.log(chalk.green(arrayofusersface))
                    this.SENT_FACESFRAME_SOCKETIO(arrayofusersface)

                },this.INTERVALTIME_getFaces
            )
        }
    }

    FORUI_STOP_GETFACE () {
        if (this.SCHEDULER_getFaces) {
            console.log("stoping get face")
            clearInterval(this.SCHEDULER_getFaces)
            this.SCHEDULER_getFaces = null
        } else {
            console.log("get face already stop")
        }
    }

    FORUI_START_GETOBJECTS () {
        if (this.SCHEDULER_getObject) {
            console.log("getObject scheduler already start")
        } else {
            console.log("starting getObject")
            this.SCHEDULER_getObject = setInterval(
                () => {
                    let arrayofobjects = []

                    for (let i of this.objectLink) {
                        i = i[1]
                        //let framebuffer = this.CALL_PicObject(i.name).GET_frame()
                            arrayofobjects.push({
                                //type: "member",
                                objecttype: "screen",
                                ownername: i.owner_name,
                                ownerID: i.owner_ID,
                                positionX: i.positionX,
                                positionY: i.positionY,
                                persistedID: i.persistedID,
                                info: ""
                            })
                    }
                    //console.log(chalk.green(arrayofobjects))
                    this.SENT_OBJECTSFRAME_SOCKETIO(arrayofobjects)

                },this.INTERVALTIME_getObject
            )
        }

    }
    FORUI_STOP_GETOBJECTS () {
        if (this.SCHEDULER_getObject) {
            console.log("stoping get object")
            clearInterval(this.SCHEDULER_getObject)
            this.SCHEDULER_getObject = null
        } else {
            console.log("get objects already stop")
        }
    }

    FORUI_START_GETFARUSERS () {
        if (this.SCHEDULER_getFarUsers) {
            console.log("getFaces scheduler already start")
        } else {
            console.log("starting getFaces")
            this.SCHEDULER_getFarUsers = setInterval(
                () => {
                    let arrayofusersface = []

                    for (let i of this.activeMember) {
                        i = i[1]
                        //console.log(chalk.green("search with i.name : " + i.name))
                        if (!this.CurrentNearbyUserLists_HASH.has(String(i.name))) {
                            //console.log("not has.." + i.name)

                                arrayofusersface.push({
                                    //type: "member",
                                    name: i.name,
                                    positionX: i.positionX,
                                    positionY: i.positionY,
                                    persistedID: null,
                                    framebuffer: i.staticfacebuffer,
                                    info: ""
                                })

                        }
                    }
                    //console.log(chalk.green(arrayofusersface))
                    /*
                    for (let i of this.CurrentNearbyUserLists_HASH) {
                        console.log(chalk.green(i))
                    }
                    console.log("----")
                    */
                    this.SENT_FARUSERSFRAME_SOCKETIO(arrayofusersface)

                },this.INTERVALTIME_getFarUsers
            )
        }

    }
    FORUI_STOP_GETFARUSERS () {
        if (this.SCHEDULER_getFarUsers) {
            console.log("stoping get faruser")
            clearInterval(this.SCHEDULER_getFarUsers)
            this.SCHEDULER_getFarUsers = null
        } else {
            console.log("get faruser already stop")
        }
    }

    FORUI_START_WORLDUI_STATICDATA () {
        if (this.SCHEDULER_WORLDUI_STATICDATA) {
            console.log("getObject scheduler already start")
        } else {
            console.log("starting scheduler")
            this.SENT_STATICWORLDUI_SOCKETIO({
                worldID: this.active_at_world_persistedID,
                worldname: this.active_at_world_name,
                static_pic_remote_object: this.STATICRemoteObjectPic
            })

            this.SCHEDULER_WORLDUI_STATICDATA = setInterval(
                () => {
                    this.SENT_STATICWORLDUI_SOCKETIO({
                        worldID: this.active_at_world_persistedID,
                        worldname: this.active_at_world_name,
                        static_pic_remote_object: this.STATICRemoteObjectPic
                    })

                },this.INTERVALTIME_getObject
            )
        }
    }
    FORUI_STOP_WORLDUI_STATICDATA () {
        if (this.SCHEDULER_WORLDUI_STATICDATA) {
            console.log("stoping sent WORLDUI staticdata")
            clearInterval(this.SCHEDULER_WORLDUI_STATICDATA)
            this.SCHEDULER_WORLDUI_STATICDATA = null
        } else {
            console.log("WORLDUI staticdata stop already stop")
        }
    }


    ///////////////////////////RemoteOBJ Page///////////////////////////
    ///////////////////////////RemoteOBJ Page///////////////////////////
    ///////////////////////////RemoteOBJ Page///////////////////////////
    ///////////////////////////RemoteOBJ Page///////////////////////////
    ///////////////////////////RemoteOBJ Page///////////////////////////


    SIGNAL_remoteobjectPageHeartbeat () {
        this.remoteobjectPage_connection_heartbeat_score = this.remoteobjectPage_connection_heartbeat_max_score
        if (this.remoteobjectPage_connection_Active === false) {
            //this.FORUI_START_RENDER_WORLD()
            this.remoteobjectPage_connection_heartbeat_Scheduler = setInterval(
                () => {
                    this.remoteobjectPage_connection_heartbeat_score--
                    if (this.remoteobjectPage_connection_heartbeat_score <= 0) {
                        clearInterval(this.remoteobjectPage_connection_heartbeat_Scheduler)
                        this.remoteobjectPage_connection_heartbeat_Scheduler = null

                        //do something
                        this.remoteobjectPage_connection_Active = false
                    }
                }, this.remoteobjectPage_connection_heartbeat_Interval_time
            )
        }
    }

    FORUI_START_RENDER_SCREENFRAME () {

    }

    FORUI_STOP_RENDER_SCREENFRAME () {

    }

    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////








    FORUI_START_FACESTREAMING () {
        let currentObject = globalSession.CALL_FaceObject(this.currentUser_name)
        this.facestreaming.START_RECORD(currentObject)
    }
    FORUI_STOP_FACESTREAMING () {
        this.facestreaming.STOP_RECORD()
    }


    FORUI_DISPLAY_VIA_SOCKETIO (newbuffer) {

    }

    callActiveMember (name, persistedID, others) {

        let currentMember = this.activeMember.get(name)
        if (!others) {
            return null
        }
        if (!currentMember) {
            console.log("no member found in memory")
            currentMember = new aciveMember_Class(name, persistedID, {positionX: others.positionX, positionY: others.positionY, IP:others.IP, PORT: others.PORT})
            this.activeMember.set(name, currentMember)
            this.setPosition_inMatrix(others.positionX, others.positionY, currentMember)
            //this.CALL_FaceObject(persistedID)
        } else {
            console.log("member already in memory")
            if (currentMember.positionX === others.positionX && currentMember.positionY === others.positionY) {
                console.log("position not changed")
            } else {
                console.log("position changed")
                this.ACTION_changeObjectPosition(currentMember, others.positionX, others.positionY)
            }
            if (currentMember.IP === others.IP && currentMember.PORT === others.PORT) {
                //console.log(`others IP: ${others.IP} PORT: ${others.PORT}`)
                console.log("IP and PORT not changed")
            } else {
                console.log("IP and PORT changed")
                currentMember.changeIPPORT(others.IP, others.PORT)
            }
        }
        return currentMember
    }

    callObjectLink (persistedID, owner_name, type, others, owner_ID) {
        let currentObject = this.objectLink.get(persistedID)
        if (!others) {
            return null
        }
        if (!currentObject) {
            console.log("no object found in memory")
            currentObject = new objectLink_Class(persistedID, owner_name, type, {positionX: others.positionX, positionY: others.positionY}, owner_ID)
            this.objectLink.set(persistedID, currentObject)
            this.setPosition_inMatrix(others.positionX, others.positionY, currentObject)
        } else {
            console.log("object already in memory")
            if (currentObject.positionX === others.positionX && currentObject.positionY === others.positionY) {
                console.log("position not changed")
            } else {
                console.log("position changed")
                this.ACTION_changeObjectPosition(currentObject, others.positionX, others.positionY)
            }

        }
        return currentObject
    }


    getMessage (message) {

    }
    sentMessage (ip, port, message) {

    }
}


        const globalSession = new session_Class()
//////This code is for tester //////////////
        /*
        globalSession.SET_CurrentUSER("Nutmos", "5a5b4fe146f399051f99b4c1", "1234")
        globalSession.SET_CurrentWorld("5a5b50a146f399051f99b4c4")
        */

/*
        globalSession.SET_CurrentUSER("Nutmos", "5a5b4fe146f399051f99b4c1", "1234")
        globalSession.SET_CurrentWorld("5a5b50a146f399051f99b4c4")
        globalSession.SET_CurrentObjectLink("5a53549dd1e30700462426d8", "cheevarit", "remote", "5a4d13a4daac5f00d435a784")
        globalSession.SET_IP_PORT("175.35.21.5", "50000")


        globalSession.callActiveMember("Nutmos", "5a5b4fe146f399051f99b4c1",{positionX: 2, positionY:2, IP: "175.35.21.5", PORT: 50000})

        globalSession.callActiveMember("chee","aaaa",{positionX: 2, positionY:2, IP: "122.15.26.5", PORT: 50000})
        globalSession.callActiveMember("david","bbbb",{positionX: 3, positionY:3, IP: "122.15.26.6", PORT: 50000})
        globalSession.callActiveMember("christin","cccc",{positionX: 4, positionY:4, IP: "122.15.26.7", PORT: 50000})
        globalSession.callActiveMember("sarah","dddd",{positionX: 5, positionY:5, IP: "122.15.26.8", PORT: 50000})
        globalSession.callActiveMember("james","eeee",{positionX: 6, positionY:6, IP: "122.15.26.9", PORT: 50000})

        globalSession.callObjectLink("00000","chee","remote",{positionX: 10,positionY: 10},"11111")
        globalSession.callObjectLink("00001","chee","remote",{positionX: 12,positionY: 10},"22222")
        globalSession.callObjectLink("00002","david","remote",{positionX: 14,positionY: 10},"33333")
*/
////////////////////////////////////////////
let logined = false
class AppUtility {
    static LogIn (name, userID, password, dummy1, IP, PORT) {
        if (logined === false) {
            globalSession.SET_CurrentUSER(name, userID, password)
            globalSession.SET_IP_PORT(IP,PORT)
            globalSession.ACTIVE_SETLOGINED()
        } else {
            console.log('Already login')
        }
    }
    static SETWORLD (worldID) {
        globalSession.SET_CurrentWorld(worldID)
    }
    static SETOBJECT (objectID, ownername, objecttype, ownerID) {
        globalSession.SET_CurrentObjectLink(objectID, ownername, objecttype, ownerID)
    }
}
module.exports.globalSession = globalSession
module.exports.session_Class = session_Class
module.exports.AppUtility = AppUtility

