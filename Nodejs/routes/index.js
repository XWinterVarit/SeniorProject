var express = require('express');
var router = express.Router();
const globalConfigs = require('../config/GlobalConfigs')
const mongotools = require(globalConfigs.mpath1.mongodb).tools
let ObjectID = require('mongodb').ObjectID
const toolController = require(globalConfigs.mpath1.toolsController)
const redistools = require(globalConfigs.mpath1.redis).tools
const chalk = require('chalk')
/* GET home page. */
