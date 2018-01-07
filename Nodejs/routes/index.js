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
let Worlds_InMemoryDatabase = new HashArray('name')

class UserData {
    constructor (name, persisted_id) {
        this.name = name
        this.persisted_id = persisted_id
        this.memberToWorlds = []
        this.groupofFriends = []

    }
}
class RemoteDesktopObject {
    constructor (persisted_id) {
        this.persisted_id = persisted_id
        this.name = ""
        this.ownertype = ""
        this.ownername = ""
    }
}
class RemoteDesktopP2PScheduler {
    constructor () {
        this.setofDeliver = []
        this.setofReceiver = []

        this.maximumDelivingPerNode = 5
        this.activeMembers = new Map()
    }
    Initiate_Deliver (membername) {
        this.setofDeliver.push({name: membername, weight: 0, ipaddr: "", port: "", sentto: []})
    }
    Distribute_to_Receiver () {
        while (this.setofReceiver.length !== 0) {
            for (let currentdeliver in this.setofDeliver) {
                if (this.setofReceiver.length === 0) {
                    break
                }
                if (currentdeliver.weight >= this.maximumDelivingPerNode) {
                    continue
                }
                currentdeliver.weight++
                let popReceiver = this.setofReceiver.pop()
                currentdeliver.sentto.push(popReceiver)
                this.setofDeliver.push(popReceiver)
            }
        }
    }


    SendToClient () {

    }
    HeartBeatCheck () {

    }
}
class CamP2PScheduler {

}
class LinksObject {
    constructor (realobject_persisted_id, persisted_id ,name) {
        this.positionx = 0
        this.positiony = 0
        this.realobject_persisted_id = realobject_persisted_id
        this.persisted_id = persisted_id

    }
}
class World {
    constructor (name, persisted_id) {
        this.name = name
        this.persisted_id = persisted_id
        this.activeMembers = new Map()
        this.groupofMembers = new Map()
        this.Objectlinks = new Map()
        this.invitations = []
    }
        force_refresh_from_Persisted ()  {

        }
        force_refresh_to_Persisted () {

        }

        get_active_member () {
            console.log("size: " + this.groupofMembers.size)
            for (let [key, value] of this.activeMembers) {
                console.log(key + " = " + JSON.stringify(value,null, 4))
            }
        }

        set_member_active (membername) {
            let currentmember = this.activeMembers.get(membername)
            if (currentmember) {
                if (currentmember.isActive) {
                    console.log("member already active")
                } else {
                    currentmember.isActive = true
                }
            } else {
                this.activeMembers.set(

                    membername,

                    {
                        isActive: true,
                        isStandby: false,
                        mongoid: null,
                        ipaddress: "192.168.1.1",
                        port: null,
                        positionx: 0,
                        positiony: 0,
                        peerworkload: [],
                        peerworkloadweight: 0
                    }

                )

            }
        }

        set_member_nonactive (membername) {
            let currentmember = this.activeMembers.get(membername)
            if (currentmember) {
                if (!currentmember.isActive) {
                    console.log("member already not active")
                } else {
                    currentmember.isActive = false
                }
            } else {
                console.log("member not active and not in the cache")
            }
        }






        addUser(Username,GroupofMemberName) {
            let currentgroup = this.groupofMembers.get(GroupofMemberName).members
            currentgroup.push("cheevarit")
            currentgroup.push("david")
            currentgroup.push("sarah")
            console.log(this.groupofMembers.get(GroupofMemberName))

        }
        addGroupofMember () {
            //console.log("hello world")

            this.groupofMembers.set('admin' ,{members: new Set()})
            this.groupofMembers.set('standard', {members: new Set()})
            this.getGroupofMemberInfo()

            this.addUser("cheevarit","admin")

        }
        getGroupofMemberInfo () {
            console.log("size: " + this.groupofMembers.size)
            for (let [key, value] of this.groupofMembers) {
                console.log(key + " = " + JSON.stringify(value,null, 4))
            }
        }




}
Worlds_InMemoryDatabase.add({name: "xtameer", world: new World("xtameer", "4r6g4re")})
router.post('/tt', (req, res, next) => {
    let world = Worlds_InMemoryDatabase.get("xtameer").world
    //console.log(world)
    world.set_member_active(req.body.name)
    res.end()
})
router.post('/tq', (req, res, next) => {
    let world = Worlds_InMemoryDatabase.get("xtameer").world
    //console.log(world)
    world.get_active_member()
    res.end()
})
router.post('/tf', (req, res, next) => {
    let world = Worlds_InMemoryDatabase.get("xtameer").world
    //console.log(world)
    world.set_member_nonactive(req.body.name)
    res.end()
})

let usertestdata = {
    name: 'cheevarit',
    mobile: '0876730025'
}
let worldtampletedata = {
    name: 'world',
    Members: null,


}
let cacheWorlds = async (tags, options) => {

}
let cacheUsers = () => {

}

router.post('/cacheWorlds', async (req, res, next) => {
    await cacheWorlds({name : 'xtameer'})
    res.end()
})

router.post('/addMemberInvitation', async (req, res, next) => {
    const collection = mongotools.db.collection('worlds')
    await new Promise(resolve => {
        /*
        collection.updateOne(
            {name: req.body.name},
            {$set :
                    {
                        Invitations :
                            [
                                {  member: [] }
                            ]
                    }
            },
            (err, response) => {
                if (err) {
                    console.log("Error " + err)
                } else {
                    console.log(response.result)
                }
                return resolve()
            }
        )
        */
        //console.log(req.body.name)
        collection.updateOne(
            {name: req.body.worldname},
            {$addToSet :
                    {"Invitations.member": req.body.name}
            },
            (err, response) => {
                if (err) {
                    console.log("Error " + err)
                } else {
                    console.log(response.result)
                }
                return resolve()
            }
        )

    })
    res.end()
})
router.post('/acceptMemberInvitation', async (req, res, next) => {

    const collection = mongotools.db.collection('worlds')
    let validation = true
    if (validation) {
        await new Promise(resolve => {
            collection.updateOne(
                {name: req.body.worldname},

                {
                    $pull:
                        {
                            "Invitations.member": req.body.name
                        }
                },

                (err, response) => {
                    if (err) {
                        console.log("Error " + err)
                    } else {
                        console.log(response.result)
                        if (response.result.nModified === 0) {
                            console.log("validation go false")
                            validation = false
                        }
                    }
                    return resolve()
                }
            )
        })
    }
    if (validation) {
        await new Promise(resolve => {
            let groupobject = {}
            collection.updateOne(
                {name: req.body.worldname},
                {
                    $addToSet:
                        {"member.standard": req.body.name}
                    //groupobject["member."+req.body.group] = req.body.name
                },
                (err, response) => {
                    if (err) {
                        console.log("Error " + err)
                    } else {
                        console.log(response.result)
                    }
                    return resolve()
                }
            )

        })
    }
    res.end()

})
router.post('/createNewWorld', async (req, res, next) => {


    console.log(JSON.stringify(req.body))
    let validation = true
    let filteroptions = {
        bool_permitprob: true,
        setarr_permitprob: new Set(['name','adminpassword'])
    }
    let filter = toolController.RequestFilter(req.body, filteroptions)
    if (filter.validation_numprob === false) {
        console.log(filter.validation_message)
        validation = false
        return res.end()
    }


    const collection = mongotools.db.collection('worlds')

    if (validation) {
        await new Promise (resolve => {
            collection.findOne(

                {'name':req.body.name}

                ,(err, docs) => {
                    if (err) {
                        console.log('database error')
                    } else if (docs) {
                        validation = false
                        console.log("world's name already found in the database")
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


    const collection = mongotools.db.collection('users')

    if (validation) {
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
