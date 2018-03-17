/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//////////////////////////Requirement Section////////////////////////
/////////////////////////////////////////////////////////////////////
///////**//This code require javascript version 6 or newer//**///////
////////////////////////miscellaneous////////////////////////////////

const express = require('express');
const router = express.Router();
const chalk = require('chalk')
const HashArray = require('hasharray')
const CircularJSON = require('circular-json')
const requestIP = require('request-ip')
const fs = require('fs')
const path = require('path')
////////////////////////////From Configs/////////////////////////////

const globalConfigs = require('../config/GlobalConfigs')
///////////////////////From Other Controllers////////////////////////

const toolController = require(globalConfigs.mpath1.toolsController)
const messagesController = require(globalConfigs.mpath1.messagesController)
const userController = require(globalConfigs.mpath1.userscontroller)
const worldController = require(globalConfigs.mpath1.worldController)
const remoteDesktopOBJController = require(globalConfigs.mpath1.remotedesktopobjController)
const globalmemoryController = require(globalConfigs.mpath1.globalmemoryController)
/////////////////////////////From Mongo//////////////////////////////

const mongotools = require(globalConfigs.mpath1.mongodb).tools
let ObjectID = require('mongodb').ObjectID
/////////////////////////////from redis//////////////////////////////

const redistools = require(globalConfigs.mpath1.redis).tools
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

router.get('/', (req, res, next) => {
    console.log("Welcome to my App")
})
router.post('/createUser',async (req, res, next) => {
    await userController.UserMethods.createUser(req,res)
    res.end()
})
router.post('/createWorld', async (req, res, next) => {
    await worldController.WorldMethods.createNew(req, res)
    res.end()
})
router.post('/addMemberInvitation', async (req, res, next) => {
    await worldController.WorldMethods.addMemberToInvitation(req, res)
    res.end()
})
router.post('/acceptMember', async (req, res, next) => {
    await worldController.WorldMethods.acceptMember(req, res)
})
router.post('/usersignal', async (req, res, next) => {
    await globalmemoryController.GlobalActiveUser.get_messages(req)
    res.end()
})
router.get('/monitor', (req, res, next) => {
    globalmemoryController.GlobalActiveUser.monitor_activeuser(res)
    //res.end()
})
router.get('/monitorWorldGlobal', (req, res, next) => {
    globalmemoryController.GlobalActiveWorld.monitorGlobalWorld(res)
})
router.post('/monWorld', async (req, res, next) => {
    await globalmemoryController.GlobalActiveWorld.Monitor(req, res)
})


router.post('/seeRemote', async (req, res, next) => {
    console.log('++++++++++++++++++++++++++++++++++++++')
    await globalmemoryController.GlobalActiveUser.get_messages(req)
    res.end()
})

router.post('/monremoteUser', async(req, res, next) => {
    await globalmemoryController.GlobalRemoteDesktopOBJ.Monitor(req, res)
})

router.post('/addRemoteObject', async (req, res, next) => {
    await remoteDesktopOBJController.RemoteDesktopMethodClass.createRemoteDesktopObject(req.body.ownername, req.body.objectname, req.body.vpath)
    res.end()
})

router.post('/addObjectLinks', async (req, res, next) => {
    await worldController.WorldMethods.addObjectLink(req.body.objid, req.body.worldid, req.body.ownername, {name: req.body.name, positionX: req.body.positionX, positionY: req.body.positionY, objecttype: "remote"})
    res.end()
})
router.post('/returnall_objectlink', async (req, res, next) => {
    await worldController.WorldMethods.returnall_objectlink(req.body.worldid)
    res.end()
})

router.post('/isMember', async (req, res, next) => {
    await worldController.WorldMethods.isMember(req.body.name, req.body.worldID)
    res.end()
})
router.get('/loadAllObj', async (req, res, next) => {
    let currentWorld = await globalmemoryController.GlobalActiveWorld.getWorldReference({worldID: "5a5b50a146f399051f99b4c4"})
    await currentWorld.loadAllObjectLink()
    res.end()
})

router.post('/saveObjLink', async (req, res, next) => {
    await worldController.WorldMethods.saveUpdateObjectLink(req.body.worldID, req.body.objlinkID,{positionX:req.body.positionX, positionY:req.body.positionY})
    res.end()
})

router.post('/getActiveMem', async (req, res, next) => {
    let currentWorld = await globalmemoryController.GlobalActiveWorld.getWorldReference({worldID: "5a5b50a146f399051f99b4c4"})
    currentWorld.signalBroadcast()
    res.end()
})

router.post('/tmp', (req, res, next) => {
    let remoteobj = globalmemoryController.GlobalRemoteDesktopOBJ
    /*
    remoteP2P1.Push_Deliver("A")

    remoteP2P1.Push_Receiver("B")
    remoteP2P1.Push_Receiver("C")
    remoteP2P1.Push_Receiver("D")
    remoteP2P1.Push_Receiver("E")
    remoteP2P1.Push_Receiver("F")
    remoteP2P1.Push_Receiver("G")
    remoteP2P1.Push_Receiver("H")
    remoteP2P1.Push_Receiver("I")

    remoteP2P1.Distribute_to_Receiver()

    remoteP2P1.print_Deliver()
    */
    res.end()

})

router.post('/testGETALLactivemem', async (req, res, next) => {
    let currentWorld = await globalmemoryController.GlobalActiveWorld.getWorldReference({worldID: "5a5b50a146f399051f99b4c4"})
    currentWorld.GETALL_ActiveMember_MessageTemplated([])
    res.end()
})
router.post('/testGETALLobject', async (req, res, next) => {
    let currentWorld = await globalmemoryController.GlobalActiveWorld.getWorldReference({worldID: "5a5b50a146f399051f99b4c4"})
    currentWorld.GETALL_ObjectLinks_MessageTemplated([])
    res.end()
})
router.post('/testREFRESH', async (req, res, next) => {
    let currentWorld = await globalmemoryController.GlobalActiveWorld.getWorldReference({worldID: "5a5b50a146f399051f99b4c4"})
    currentWorld.REFRESH_ALL_toClient()
    res.end()
})



router.post('/saveAllMemberInfo', async (req, res, next) => {
    let currentWorld = await globalmemoryController.GlobalActiveWorld.getWorldReference({worldID: "5a5b50a146f399051f99b4c4"})
    await currentWorld.callActiveMember("Nutmos",{positionX: 20, positionY:50})
    await currentWorld.callActiveMember("Wanwipa",{positionX: 20, positionY:40})
    await currentWorld.callActiveMember("BoonLEDTV",{positionX: 20, positionY:30})

    //await currentWorld.saveAllMemberInfo()
    currentWorld.GETALL_ActiveMember_MessageTemplated()
    res.end()
})

router.post('/moveUserPosition', async (req, res, next) => {
    let currentWorld = await globalmemoryController.GlobalActiveWorld.getWorldReference({worldID: "5a5b50a146f399051f99b4c4"})
    currentWorld.callActiveMember(req.body.name,new currentWorld.OPTIONAL_TEMPLATE_callActiveUser(req.body.positionX, req.body.positionY, null, true))
    res.end()
})
router.post('/moveObjectPosition', async (req, res, next) => {
    let currentWorld = await globalmemoryController.GlobalActiveWorld.getWorldReference({worldID: "5a5b50a146f399051f99b4c4"})
    currentWorld.callObjectLink(req.body.persistedID, new currentWorld.OPTIONAL_TEMPLATE_callObjectLink(req.body.positionX, req.body.positionY, null))
    res.end()
})
// Real path

router.post('/userGateway', async(req, res, next) => {
    let clientIP = requestIP.getClientIp(req)
    //console.log(chalk.green("IP : " + clientIP))
    //console.log(chalk.green(CircularJSON.stringify(req, null, 4)))
    await globalmemoryController.GlobalActiveUser.get_messages(req)
    res.end()
})

router.post('/getMemberedWorlds', async(req, res, next) => {
    res.json(await userController.UserMethods.readAllMembered_Worlds(req.body.name))
})

router.post('/getWorldMembers', async(req, res, next) => {
    res.json(await worldController.WorldMethods.getAllMember(req.body.worldID))
})


router.post('/testuserGateway', async(req, res, next) => {
    let vreq = {
        body: {
            name: "Nutmos",
            type: "toone",
            activeworld: "5a5b50a146f399051f99b4c4",
            ipaddr: "127.0.0.1",
            port: "50001",
        }
    }
    await globalmemoryController.GlobalActiveUser.get_messages(vreq)

    vreq = {
        body: {
            name: "Wanwipa",
            type: "toone",
            activeworld: "5a5b50a146f399051f99b4c4",
            ipaddr: "127.0.0.1",
            port: "50002"
        }
    }
    await globalmemoryController.GlobalActiveUser.get_messages(vreq)
    vreq = {
        body: {
            name: "BoonLEDTV",
            type: "toone",
            activeworld: "5a5b50a146f399051f99b4c4",
            ipaddr: "127.0.0.1",
            port: "50003"
        }
    }

    await globalmemoryController.GlobalActiveUser.get_messages(vreq)

    let currentWorld = await globalmemoryController.GlobalActiveWorld.getWorldReference({worldID: "5a5b50a146f399051f99b4c4"})
    currentWorld.TEMPTEST_printactivemember()
    //currentWorld.TEMPTEST_printobjectlink()
    res.end()
})

router.post('/testinfo', async (req, res, next) => {
    let message = await worldController.WorldMethods.loadMemberInfo("5a5b50a146f399051f99b4c4", "Nutmos")
    console.log(chalk.green(JSON.stringify(message, null, 4)))
    res.end()
})

router.post('/testCreateObject', async (req, res, next) => {
    let currentworld = await globalmemoryController.GlobalActiveWorld.getWorldReference({worldID: "5a5b50a146f399051f99b4c4"})

    if (currentworld) {
        //await currentworld.ACTION_createObject("remote", new currentworld.OPTIONAL_TEMPLATE_createobject_remotedesktop("Nutmos", "myremote", "/", "7","9"))
        await currentworld.ACTION_createObject("remote", new currentworld.OPTIONAL_TEMPLATE_createobject_remotedesktop("Wanwipa", "myremote", "/", "7","10"))

    } else {
        console.log("no world found")
    }

    res.end()
})

router.post('/MONITOR_WORLD', async (req, res, next) => {
    console.log(chalk.green(JSON.stringify(req.body)))
    let currentWorld = await globalmemoryController.GlobalActiveWorld.getWorldReference({worldID: req.body.worldID})
    res.send(currentWorld.MONITOR_World())
})

router.post('/MONITOR_REMOTEDESKTOPOBJ', async (req, res, next) => {
    let currentObject = await globalmemoryController.GlobalRemoteDesktopOBJ.callObject(req.body.objectID, req.body.ownername)
    //console.log("show current object")
    //console.log(chalk.yellow(CircularJSON.stringify(currentObject.data, null, 4)))
    //console.log(JSON.stringify(currentObject, null, 4))
    let messages = currentObject.data.monitorObject()
    res.send(messages)
})

router.post('/MONITOR_QUICKOBJECTINFO', (req, res, next) => {
    res.send(globalmemoryController.ObjectQuickInfo.MONITOR())
})

router.post('/')


router.post('/testimage', (req, res, next) => {
    //let imagebuffer = fs.readFileSync(path.join(globalConfigs.mpath1.remotetest, 'cat.jpg'))
    let imagebuffer = new Buffer("Well")
    console.log(imagebuffer.length)
    let prearray = [
        "REMF", //route
        "123", //objectID
        "456", //ownerID
        "789", //ownerName
        "1", //framenumber
        "125489498", //timestamp
        imagebuffer //framebuffer
    ]
    let combinedbuffer = toolController.BufferUtility.createBuffer(prearray)
    messagesController.messagesGlobalMethods.udpOutputQueue("127.0.0.1", "44444", combinedbuffer)
    res.end()
})


module.exports = router;