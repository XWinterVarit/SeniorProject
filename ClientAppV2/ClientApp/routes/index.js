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
////////////////////////////From Configs/////////////////////////////

const globalConfigs = require('../config/GlobalConfigs')
///////////////////////From Other Controllers////////////////////////

const streamController = require(globalConfigs.mpath1.streamController)
const sessionController = require(globalConfigs.mpath1.sessionController)
const messagesController = require(globalConfigs.mpath1.messagesController)
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

router.get('/sessionMonitor', (req, res, next) => {
    res.send(sessionController.globalSession.MONITOR_Session())
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

    messagesController.messagesGlobalMethods.httpInput(messages)
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

router.post('/removeObjectLink', (req, res, next) => {
    let messages = {
        body: {
            type: "remove",
            lists: [

            ]
        }
    }
})
router.get('/getSessionInfo')
module.exports = router;
