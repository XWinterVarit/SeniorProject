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

const multer = require('multer')
const uploadService = multer({storage: multer.memoryStorage()})
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










////////////////////////////////////////////////////////////////////////
//////////////////////////////Real Path/////////////////////////////////
//////////////////////////////Real Path/////////////////////////////////
//////////////////////////////Real Path/////////////////////////////////
////////////////////////////////////////////////////////////////////////


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

router.post('/setAvatar', async(req, res, next) => {

})










////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

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
router.get('/TestSendBuffer', (req, res, next) => {



  /*  let imagebuffer = fs.readFileSync(path.join(globalConfigs.mpath1.remotetest, 'cat3.mov'))
    //messagesController.messagesGlobalMethods.httpOutput_POST("127.0.0.1","50001",messagesController.ClientPathTemplated.clientHTTPFrameUpdate,{frame: imagebuffer})

    messagesController.messagesGlobalMethods.formdata_httpOutput_ANY_TEMP("127.0.0.1","50001", messagesController.ClientPathTemplated.clientHTTPFrameUpdate, imagebuffer)
*/
    res.end()


})
router.post('/')


router.post('/testimage', async (req, res, next) => {
    let imagebuffer = new Buffer.from(fs.readFileSync(path.join(globalConfigs.mpath1.remotetest, 'cat2.jpg')))
    let currentTime = new Date().getTime()

    //let imagebuffer = new Buffer("Well")
    console.log(imagebuffer.length)
    let prearrayinit = [
        "REMF", //route
        "a",//ObjectID
        "b",//ownerID
        "c",//ownerName
        "1",//framenumber
        imagebuffer
    ]
    /*
    let prearray = [
        "REMF", //route
        "123", //PieceNumberOfPiece 2/10
        "", //timestamp
        "1", //framenumber
        imagebuffer //framebuffer
    ]
    */
    let combinedbuffer = toolController.BufferUtility.createBuffer(prearrayinit)
    await messagesController.messagesGlobalMethods.udpOutputV2(["127.0.0.1","50001", combinedbuffer])


    //messagesController.messagesGlobalMethods.udpOutputQueue("127.0.0.1", "44444", imagebuffer)
    //let imagesCutted = toolController.BufferUtility.bufferCutter(imagebuffer,1400) //arrays
/*
    let count = 0

    prearrayinit[2] = String(currentTime)
    prearray[2] = String(currentTime)
    let counta = 0
    */
    /*
    for (let i of imagesCutted) {
        counta++
        console.log("show present buffer size : " + i.length)
    }
    */
  /*
    let combinebuffer = null
    for (let i of imagesCutted) {
        combinebuffer = null
        //console.log("show **** buffer size : " + combinebuffer.length)
        //console.log("isBuffer " + Buffer.isBuffer(i))

        if (count === 0) {
            prearrayinit[1] = "1/"+imagesCutted.length
            prearrayinit[7] = i
            combinebuffer = toolController.BufferUtility.createBuffer(prearrayinit)
            console.log("show present buffer size : " + combinebuffer.length)
            //await messagesController.messagesGlobalMethods.udpOutput(["127.0.0.1","44444",combinebuffer])
        } else {
            prearray[1] = count+"/"+imagesCutted.length
            prearrayinit[4] = i
            combinebuffer = toolController.BufferUtility.createBuffer(prearray)
            console.log("show present buffer size : " + combinebuffer.length)
            //await messagesController.messagesGlobalMethods.udpOutput(["127.0.0.1","44444",combinebuffer])
        }
        await new Promise(resolve => {
            setTimeout(
                ()=>{
                    return resolve()
                },1000
            )
        })
        count++

    }
*/
    res.end()
})
router.post('/testtime',uploadService.single('file'), async (req, res, next) => {
    let headerdata = JSON.parse(req.body.headerdata)
    let framebuffer = req.file.buffer
    if (framebuffer == null) {
        console.log(chalk.red("no frame buffer, IGNORE update"))
        return res.end()
    }
    await userController.UserMethods.setUserStaticAvatar(req.body.username)
})

module.exports = router;