/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//////////////////////////Requirement Section////////////////////////
/////////////////////////////////////////////////////////////////////
///////**//This code require javascript version 6 or newer//**///////
////////////////////////miscellaneous////////////////////////////////

const express = require('express');
const router = express.Router();
const chalk = require('chalk')
const Queue = require('queue')
const CircularJSON = require('circular-json')
const multer = require('multer')
const uploadService = multer({storage: multer.memoryStorage()})
const fs = require('fs')
////////////////////////////From Configs/////////////////////////////

const globalConfigs = require('../config/GlobalConfigs')
///////////////////////From Other Controllers////////////////////////

const sessionController = require(globalConfigs.mpath1.sessionController)
const messagesController = require(globalConfigs.mpath1.messagesController)

//const streamController = require(globalConfigs.mpath1.streamController)
const toolsController = require(globalConfigs.mpath1.toolsController)
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/matrix', (req, res, next) => {
    let newSession = new sessionController.session_Class()
    newSession.printMatrix()
    res.end()
})
router.get('/fillmatrix', (req, res, next) => {
    let newSession = new sessionController.session_Class()
    newSession.getMatrixInfo()
    res.end()
})
router.get('/setMatrix', (req, res, next) => {
    let newSession = new sessionController.session_Class()
    newSession.setPosition_inMatrix(2,2,"A")
    newSession.setPosition_inMatrix(3,4,"B")
    newSession.setPosition_inMatrix(5,4,"C")
    newSession.printMatrix(5,5)
    res.end()
})

router.get ('/testjson', (req, res, next) => {
    messagesController.messagesGlobalMethods.test()
    res.end()
})

router.get('/testMessage', (req, res, next) => {
    messagesController.messagesGlobalMethods.test()
    sessionController.globalSession.PRINT_info()
    res.end()
})

router.get('/testQ', async (req, res, next) => {
    let queue = new toolsController.Group_Queue_Class()
    let workA = new toolsController.WorkSomething("AAAAA:")
    let workB = new toolsController.WorkSomething("BBBBB:")
    let workC = new toolsController.WorkSomething("CCCCC:")
    let workD = new toolsController.WorkSomething("*****:")

    queue.ADD_queue(workA, {specialtext: "Well"})
    queue.ADD_queue(workB, {specialtext: "oh god"})
    queue.ADD_queue(workC, {specialtext: "Cat"})

    let testclass = class {
        static async DOTASK(args, queueRef) {
            console.log(workA.text)
            console.log(workB.text)
            console.log(workC.text)
            console.log(workD.text)

            await queueRef.REDUCE_worksize()
            toolsController.Group_Queue_Class.DO_queue(queueRef)

        }
    }

    queue.ADD_queue(
        testclass
    , null)

    setTimeout(
        () => {
            queue.ADD_queue(workD, {specialtext: "test interrupt"})
            queue.ADD_queue(testclass, null)
        }
        ,10000
    )
    //toolsController.Group_Queue_Class.DO_queue(queue)

/*
    setTimeout(
        ()=>{
            console.log(workA.text)
            console.log(workB.text)
            console.log(workC.text)
        },5000
    )
*/
    res.end()
})

router.post('/callSession', (req, res, next) => {
    console.log(req.body)
    res.end()
})


router.post('/callUser', (req, res, next) => {
    let messages = {
        body: {
            type: "update",
            lists: [
                {type: "member", name: req.body.name, persistedID: req.body.persistedID, positionX: req.body.positionX, positionY: req.body.positionY, standby: req.body.standby, IP : req.body.IP, PORT : req.body.PORT}
            ]
        }
    }

    messagesController.messagesGlobalMethods.httpInputQueue(messages)
    res.end()
})

router.post('/callObjectLink', (req, res, next) => {
    let messages = {
        body: {
            type: "update",
            lists: [
                {type:"object" ,subtype: "object", owner_name: req.body.owner_name, persistedID: req.body.persistedID, positionX: req.body.positionX, positionY: req.body.positionY}
            ]
        }
    }
    messagesController.messagesGlobalMethods.httpInput(messages)
    res.end()
})
router.post('/refreshObjectLink', (req, res, next) => {
    let messages = {
        body: {
            type: "refresh",
            lists: [
                {type:"object" ,subtype: "object", owner_name: req.body.owner_name, persistedID: req.body.persistedID, positionX: req.body.positionX, positionY: req.body.positionY}
            ]
        }
    }
    messagesController.messagesGlobalMethods.httpInput(messages)
    res.end()

})
router.post('/drainq', (req, res, next) => {
    messagesController.requestQueue.DEBUG_continuequeue()
    res.end()
})
router.post('/removeObjectLink', (req, res, next) => {
    let messages = {
        body: {
            type: "remove",
            lists: [
                {type: "object", persistedID: req.body.persistedID}
            ]
        }
    }
    messagesController.messagesGlobalMethods.httpInput(messages)
    res.end()
})
router.post('/removeMember', (req, res, next) => {
    let messages = {
        body: {
            type: "remove",
            lists: [
                {type: "member", name: req.body.name}
            ]
        }
    }
    messagesController.messagesGlobalMethods.httpInput(messages)
    res.end()
})

// Official Path

router.post('/clientUserGateway', (req, res, next) => {
    //console.log(chalk.blueBright(JSON.stringify(req.body, null, 4)))
    messagesController.messagesGlobalMethods.httpInput(req)
    res.end()
})
router.post('/clientRemoteGateway', (req, res, next) => {
    messagesController.messagesGlobalMethods.updateRemoteP2PTask(req)
    res.end()
})
router.post('/setFirstStart', (req, res, next) => {
    console.log("req " + CircularJSON.stringify(req ,null, 4))
    sessionController.globalSession.SET_CurrentUSER(req.body.name, req.body.userID, req.body.password)
    if (req.body.objectID) {
        sessionController.globalSession.SET_CurrentObjectLink(req.body.objectID, req.body.ownername, req.body.objecttype, req.body.ownerID)
    }
    sessionController.globalSession.SET_CurrentWorld(req.body.worldID)
    sessionController.globalSession.SET_IP_PORT(req.body.IP, req.body.PORT)
    sessionController.globalSession.PRINT_info()
    if (req.body.remoteobjectID) {
        sessionController.globalSession.SET_REMOTE_OBJECTID(req.body.remoteobjectID)
    }
    res.end()
})
router.post('/clientHTTPREMF',uploadService.single('file'), (req, res, next) => {
    /*
    let framebuffer = req.body.frame
    console.log(`receive image frame length : ${framebuffer.length}`)
    */

    messagesController.messagesGlobalMethods.updateRemoteFrame_HTTP(req)
    res.end()


//  EXAMPLE code for multer
/*
    console.log(req.body.my_field)
    let downloadfile = req.file
    //downloadfile = Buffer.from(downloadfile)
    console.log(typeof downloadfile)
    console.log(downloadfile)
    //fs.writeFileSync(globalConfigs.testpath1.data + "test.mov", downloadfile.buffer )
    //console.log(downloadfile.length)

    //console.log(CircularJSON.stringify(req, null, 4))
    res.end()
*/

})
let count = 0
router.get('/testwebsocket', (req, res, next) => {
    count++
    if (count % 2 === 0) {
        console.log("first pic")
        let buffer = fs.readFileSync(globalConfigs.testpath1.data + "cat2.jpg")
        sessionController.globalSession.TEST_MONITOR_SOCKETIO(buffer)
    } else {
        console.log("second pic")
        let buffer = fs.readFileSync(globalConfigs.testpath1.data + "cat3.jpg")
        sessionController.globalSession.TEST_MONITOR_SOCKETIO(buffer)
    }
    res.end()
})


router.post('/testSentFile', async (req, res, next) => {
    let framebuffer = new Buffer("Welcome")
    await messagesController.messagesGlobalMethods.formdata_httpOutput_ANY_ONEBuffer("127.0.0.1",40000
        , "clientHTTPREMF"
        , messagesController.messagesTemplates.UNICAST_UPDATEFRAME_HEADER_FORMDATA("555", 123, "123", "123", "123", "123")
        , messagesController.messagesTemplates.ONE_BUFFERDATA_FORFORMDATA(framebuffer,"frame", messagesController.messagesTemplates_ClientPathTempleted.application_any))
    res.end()
})


//

router.get('/sessionMonitor', (req, res, next) => {
    res.send(sessionController.globalSession.MONITOR_Session())
})

router.get('/remoteMonitor', (req, res, next) => {
    let currentObject = sessionController.globalSession.CALL_RemoteObject(sessionController.globalSession.active_at_object_persistedID, sessionController.globalSession.object_owner_name, sessionController.globalSession.object_owner_ID)

    res.send(currentObject.RemoteDesktopRedirectTask.MONITOR())
})



router.get('/FORUI_getallactivemember', (req, res, next) => {
    res.json(sessionController.globalSession.FORUI_getallactivemember())
})
router.get('/FORUI_getallobjectlinks', (req, res, next) => {
    res.json(sessionController.globalSession.FORUI_getallobjectlinks())
})
router.post('/FORUI_getinfo_fromPosition', (req, res, next) => {
    res.json(sessionController.globalSession.FORUI_getinfo_fromPosition(req.body.positionX, req.body.positionY))
})
router.post('/CONTROL_MoveToPosition', (req, res, next) => {
    res.json(sessionController.globalSession.CONTROL_MoveToPosition(req.body.positionX, req.body.positionY))
})


router.post('/CONTROL_StartRecord', (req, res, next) => {
    sessionController.globalSession.CONTROL_START_BroadcastScreen()
    res.end()
})
router.post('/CONTROL_StopRecord', (req, res, next) => {
    sessionController.globalSession.CONTROL_STOP_BroadcastScreen()
    res.end()
})

module.exports = router;
