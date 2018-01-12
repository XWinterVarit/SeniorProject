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
////////////////////////////From Configs/////////////////////////////

const globalConfigs = require('../config/GlobalConfigs')
///////////////////////From Other Controllers////////////////////////

const toolController = require(globalConfigs.mpath1.toolsController)
const userController = require(globalConfigs.mpath1.userscontroller)
const worldController = require(globalConfigs.mpath1.worldController)
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
router.post('/sendtoUser', async (req, res, next) => {
    await globalmemoryController.GlobalActiveUser.get_messages(req)
    res.end()
})
router.get('/monitor', (req, res, next) => {
    globalmemoryController.GlobalActiveUser.monitor_activeuser(res)
    //res.end()
})

router.post('/pushRecei', async (req, res, next) => {
    remoteP2P1.Push_Receiver("B")
    remoteP2P1.Push_Receiver("C")
    remoteP2P1.Push_Receiver("D")
    remoteP2P1.Push_Receiver("E")
    remoteP2P1.Push_Receiver("F")
    remoteP2P1.Push_Receiver("G")
    remoteP2P1.Push_Receiver("H")
    remoteP2P1.Push_Receiver("I")
    res.end()
})
router.post('/printDeli', (req, res, next) => {
    remoteP2P1.print_Deliver()
    res.end()
})


router.post('/')

module.exports = router;