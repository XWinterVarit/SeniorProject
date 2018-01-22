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
const userController = require(globalConfigs.mpath1.userscontroller)
const worldController = require(globalConfigs.mpath1.worldController)
const remoteDesktopOBJController = require(globalConfigs.mpath1.remotedesktopobjController)
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

module.exports.GlobalActiveUser = new userController.GlobalActiveUserClass()

module.exports.GlobalRemoteDesktopOBJ = new remoteDesktopOBJController.Group_RemoteDesktop()

module.exports.GlobalActiveWorld = new worldController.GlobalActiveWorldClass()