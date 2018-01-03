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
    redistools.redis.sadd('foo',['a','b','c'])
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



const ndarray = require('ndarray')
/*
let mat = ndarray(new Int32Array(10))
let arraysize = mat.shape[0]
for (i = 0; i < arraysize; i++) {
    mat.set(i, i);
}
for (i = 0; i < arraysize; i++) {
    console.log(mat.get(i));
}
*/
const HashArray = require('hasharray')
let Users_InMemoryDatabase = new HashArray('name')

class UserData {
    constructor (name, persisted_id) {
        this.name = name
        this.persisted_id = persisted_id
        this.memberToWorlds = []
        this.groupofFriends = []

    }
}
class World {
    constructor (name, persisted_id) {
        this.name = name
        this.persisted_id = persisted_id
        this.activeMembers = []
        this.groupofMembers = []
        this.objects = []
        this.invitations = []
    }
    force_refresh_from_Persisted () {

    }
    force_refresh_to_Persisted () {

    }
}

let usertestdata = {
    name: 'cheevarit',
    mobile: '0876730025'
}
let worldtampletedata = {
    name: 'world',
    Members: null,

}
router.get('/createNewWorld', async (req, res, next) => {
    const collection = mongotools.db.collection('worlds')
    let founded_persistent = false
    await new Promise (resolve => {
        collection.findOne(

            {'name':'cheevarit'}

            ,(err, docs) => {
                if (err) {
                    console.log('database error')
                } else if (docs) {
                    founded_persistentuser = true
                    console.log(docs)
                } else {
                    console.log('data not found in record')
                }
                return resolve()
            }
        )
    })

    if (!founded_persistent) {
        await new Promise(resolve => {
            collection.insertOne(
                usertestdata,
                (err)=> {
                    if (err){
                        console.log(err)
                    }
                    return resolve()
                }
            )
        })
        console.log("write completed")
    }

    console.log("completed")
    res.end()
})
router.post('/createNewUsers', async (req, res, next) => {
    console.log(JSON.stringify(req.body))
    let validation = true
    let filteroptions = {
        bool_permitprob: true,
        setarr_permitprob: new Set(['name', 'emailaddr','password'])
    }
    let filter = toolController.RequestFilter(req.body, filteroptions)
    if (filter.validation_numprob === false) {
        console.log(filter.validation_message)
        validation = false
        return res.end()
    }
    if (Users_InMemoryDatabase.has(req.body.name)) {
        console.log("This name already taken!")
        validation = false
    }
    if (validation) {
        const collection = mongotools.db.collection('users')
        await new Promise (resolve => {
            collection.findOne(

                {'name':req.body.name}

                ,(err, docs) => {
                    if (err) {
                        console.log('database error')
                    } else if (docs) {
                        validation = false
                        console.log("user already found in the database")
                        //console.log(docs)
                    } else {
                        console.log('data not found in record')
                    }
                    return resolve()
                }
            )
        })
    }
    if (validation) {
            await new Promise(resolve => {
                collection.insertOne(
                    req.body,
                    (err)=> {
                        if (err){
                            console.log(err)
                        }
                        return resolve()
                    }
                )
            })
            console.log("write completed")
    }
    res.end()
})
router.post('editWorld', async(req, res, next) => {

    res.end()
})
router.get('/add', (req ,res, next) => {
    console.log("Welcome")
    if (Users_InMemoryDatabase.has('cheevarit')) {
        console.log("this name already had");
    } else {
        Users_InMemoryDatabase.add({name: 'cheevarit', data: new UserData('cheevarit', '41gr6eg6')})
    }
    res.end()
})
router.get('/get', (req, res, next) => {
    let UserData = Users_InMemoryDatabase.get('cheevarit')
    console.log(JSON.stringify(UserData, null, 4))
    res.end()
})


module.exports = router;
