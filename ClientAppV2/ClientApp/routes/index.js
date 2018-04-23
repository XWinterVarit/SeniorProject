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
var iconv = require('iconv-lite');


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
    sessionController.globalSession.ACTIVE_SETLOGINED()
    setTimeout(
        ()=>{
            sessionController.globalSession.SET_CurrentWorld(req.body.worldID)

            setTimeout(
                ()=>{
                    if (req.body.objectID) {
                        sessionController.globalSession.SET_CurrentObjectLink(req.body.objectID, req.body.ownername, req.body.objecttype, req.body.ownerID)
                    }


                    sessionController.globalSession.SET_IP_PORT(req.body.IP, req.body.PORT)
                    sessionController.globalSession.PRINT_info()
                    res.end()
                },4000
            )



        },500
    )

    /*
    if (req.body.remoteobjectID) {
        sessionController.globalSession.SET_REMOTE_OBJECTID(req.body.remoteobjectID)
    }
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

router.get('/world', (req, res, next) => {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.sendFile(globalConfigs.wpath1.webpage + 'WorldPage.html')
})
router.get('/remote', (req, res, next) => {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.sendFile(globalConfigs.wpath1.webpage + 'RemoteObjectPage.html')
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


router.post('/FORUI_LogIn', (req, res, next) => {
    sessionController.AppUtility.LogIn(req.body.name, req.body.userID, req.body.password, null, req.body.IP, req.body.PORT)
    res.end()
})
router.post('/FORUI_SETWORLD', (req, res, next) => {
    sessionController.AppUtility.SETWORLD(req.body.worldID)
    res.end()
})
router.post('/FORUI_SETOBJECT', (req, res, next) => {
    sessionController.AppUtility.SETOBJECT(req.body.objectID, req.body.ownername, req.body.objecttype, req.body.ownerID)
    res.end()
})

router.get('/SET_FACE_STREAM_ON', (req, res, next) => {

})
router.get('/SET_FACE_STREAM_OFF', (req, res, next) => {

})
router.get('/SET_SCREEN_STREAM_ON', (req, res, next) => {

})
router.get('/SET_SCREEN_STREAM_OFF', (req, res, next) => {

})



router.post('/FORUI_SETOBJECTV2', (req, res, next) => {
    if (req.body.objectID === "") {
        sessionController.AppUtility.SETOBJECT("","","","")
    } else {
        sessionController.AppUtility.SETOBJECT(req.body.objectID, req.body.ownername, req.body.objecttype, req.body.ownerID)
        console.log(chalk.bold(JSON.stringify(req.body, null, 4)))
    }
    res.end()
})
router.post('/FORUI_CREATEREMOTEOBJECT', (req, res, next) => {
    sessionController.globalSession.CONTROL_CreateRemoteObject(req.body.positionX, req.body.positionY)
    res.end()
})
/*
router.get('/remoteobjpage', (req, res, next) => {
    res.sendFile(globalConfigs.testpath1.camtest + "RemoteObjectPage.html")
})
*/
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

router.post('/clientHTTPFaceF', uploadService.single('file'), (req, res, next) => {
    messagesController.messagesGlobalMethods.updateFaceFrame(req)
    res.end()
})

router.post('/createRemoteObject', (req, res, next) => {
    sessionController.globalSession.CONTROL_CreateRemoteObject(req.body.positionX, req.body.positionY)
    res.end()
})

/*
router.get('/FrameImageDebug', (req, res, next) => {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.sendFile(globalConfigs.testpath1.monitorGUI + 'test.html')
})
*/
router.get('/showfaces', (req, res, next) => {
    sessionController.globalSession.FORUI_START_GETFACE()
    res.end()
})
router.get('/man_startface', (req, res, next) => {
    sessionController.globalSession.FORUI_START_FACESTREAMING()
    res.end()
})
router.get('/man_stopface', (req, res, next) => {
    sessionController.globalSession.FORUI_STOP_FACESTREAMING()
    res.end()
})
router.get('/man_startscreenstream', (req, res, next) => {
    sessionController.globalSession.CONTROL_START_BroadcastScreen()
    res.end()
})
router.get('/man_stopscreenstream', (req, res, next) => {
    sessionController.globalSession.CONTROL_STOP_BroadcastScreen()
    res.end()
})
/*
router.get('/FaceImageDebug', (req, res, next) => {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.sendFile(globalConfigs.testpath1.camtest + 'faceMon.html')
})
router.get('/FacesDebug', (req, res, next) => {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.sendFile(globalConfigs.testpath1.camtest + 'testdynamic.html')
})
*/
router.get('/NearbyCalStart', (req, res, next) => {
    sessionController.globalSession.CONTROL_START_GETNEARBY_SCHEDULER()
    res.end()
})
router.get('/NearbyCalStop', (req, res, next) => {
    sessionController.globalSession.CONTROL_STOP_GETNEARBY_SCHEDULER()
    res.end()
})

router.get('/GetNearby', (req, res, next) => {
    let nearbylist = sessionController.globalSession.CurrentNearbyUserLists
    for (let i of nearbylist) {
        console.log(i)
    }
})

router.post('/testAvatar', async (req, res, next) => {
    let data = await messagesController.messagesGlobalMethods.httpOutput_POST_SERVER_V2withASYNC('getAvatar', {
        username: req.body.username
    })
    console.log("pass2")

    console.log(data.length)
    res.end()
})

router.post('/pythontest', uploadService.single('file'), (req, res, next) => {
    if (!req.file) {
        console.log("file not found")
        return false
    }
    if (!req.file.buffer) {
        console.log("buffer not found")
        return false
    }
    console.log("python buffer length : " + req.file.buffer.length)
    // Convert from an encoded buffer to js string.
  /*
    let str = iconv.decode(req.file.buffer, 'ISO-8859');
    str = Buffer.from(str)
    console.log("after encode buffer length : " + str.length)
*/
  /*
    fs.writeFile("./well.jpg", req.file.buffer, ()=>{
        console.log("completed")
    })
*/
    sessionController.globalSession.SIGNAL_OPENCV_FACE_RECORD(req.file.buffer)
    res.end()
})
module.exports = router;
