var express = require('express');
var router = express.Router();
const globalConfigs = require('../config/GlobalConfigs')
const mongotools = require(globalConfigs.mpath1.mongodb).tools
const toolController = require(globalConfigs.mpath1.toolsController)
const redistools = require(globalConfigs.mpath1.redis).tools
const chalk = require('chalk')
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});
router.get('/d', (req, res, next)=>{
    console.log(globalConfigs.mpath1.nodepath)
    console.log(globalConfigs.mpath1.config)
    console.log(globalConfigs.mpath1.globalconfigs)
    console.log(globalConfigs.mpath1.mongodb)

    mongotools.db.collection('userssss').insertOne(
        {grade: toolController.randomInteger(0,10) },
        (err, result) => {
            if (err)
                console.log(chalk.red(err))
            else
                console.log(chalk.green(result))
        }
    )
    /*
            mongotools.db.collection('userssss').createIndex(
                { grade:1},
                (err, result) => {
                        if (err)
                                console.log(err)
                        else
                                console.log(result)
                }
            )*/
    /*
            mongotools.db.createCollection("Gooooooodd",{}, (err, result)=>{
                    if (err) {
                            console.log("Found Error")
                            console.log(err)
                    }
                    console.log("add completed")
            })
            */

    /*
    db.createCollection("Goodddddd",{}, (err, result) => {
            console.log("Gooodddd is created")
    })
    */
    res.end()
})
router.get('/getdoc', (req, res, next) => {
    const collection = mongotools.db.collection('userssss')
    collection.find({}).toArray((err, docs) => {
        if (err) {
            console.log('database error')
        } else {
            console.log(docs)
        }
    })
    res.end()
})
router.post('/adduser', (req, res, next) => {
    const collection = mongotools.db.collection('users')
    if (!req) {
        console.log("not found")
    } else {

    }
})
router.get('/r', (req, res, next)=>{
    redistools.redis.set('foo','bar')
    redistools.redis.get('foo', (err, results)=>{
        console.log("my result : " + results)
    })
    res.end()
})
router.get('/test', (req, res, next) => {
    const request = {
        name: "well",
        lastname: "cheevarit"
    }
    let permitProperties = new Set()
    permitProperties.add("name")
    permitProperties.add("well")
    //permitProperties.add("lastname")
    console.log(permitProperties)
    let options = {
        bool_permitprob: true,
        setarr_permitprob: permitProperties
    }
    toolController.RequestFilter(request, options)
})
module.exports = router;
