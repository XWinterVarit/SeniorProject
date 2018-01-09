var express = require('express');
var router = express.Router();
const globalConfigs = require('../config/GlobalConfigs')
const mongotools = require(globalConfigs.mpath1.mongodb).tools
let ObjectID = require('mongodb').ObjectID
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
class OneActiveUserClass {
    constructor (persisted_id, name) {
        this.persisted_id = ""
        this.name = ""
        this.ipaddr = ""
        this.port = ""
        this.standby = false
        this.active = false
        this.active_at_world = ""
        this.active_at_objectID = ""

        this.heartbeatIntervalTime = 5 //sec
        this.heartbeatTimer = null
        this.heartbeatScore = 0
    }

    set_active_world (worldname) {
        if (this.active_at_world === worldname){
            console.log("not change active world")
        } else {
            console.log("change activeworld")
        }
    }

    set_active_objectID (objectID) {
        if (this.active_at_objectID === objectID){
            console.log("not change active object")
        } else {
            console.log("change activeobject")
        }
    }

    set_IP (ip) {
        if (this.ipaddr === ip){
            console.log("ip not change")
        } else {
            console.log("ip changed")
        }
    }

    set_port (port) {
        if (this.port === port){
            console.log("port not change")
        } else {
            console.log("port change")
        }
    }

    start_heartbeat () {
        this.active = true
  /*
        if (this.heartbeatTimer === null) {

        } else {
            clearTimeout(this.heartbeatTimer)
        }

        this.heartbeatTimer = setTimeout(
            () => {
                this.active = false
            }, this.heartbeatIntervalTime
        )
*/
        this.heartbeatTimer = setInterval(
            () => {
                this.heartbeatScore--
                if (this.heartbeatScore <= 0) {
                    clearInterval(this.heartbeatTimer)
                    this.active = false
                }
            }, this.heartbeatIntervalTime
        )

    }

    signal_heartbeat () {
        this.heartbeatScore = 2
        if (this.active === false) {
            this.start_heartbeat()
        }
    }

    get_messages (req) {
        //console.log("hello from : " + this.name + "  " + this.persisted_id)
        this.signal_heartbeat()
        if (req.body.standby !== undefined) {
            this.standby = req.body.standby
        }
        if (req.body.ipaddr) {
            this.set_IP(req.body.ipaddr)
        }
        if (req.body.port) {
            this.set_port(req.body.port)
        }
        if (req.body.activeworld) {
            this.set_active_world(req.body.activeworld)
        }
        if (req.body.activeobject) {
            this.set_active_objectID(req.body.activeobject)

        }
    }

    sent_messages () {

    }


}

class GlobalActiveUserClass {
    constructor () {
        this.ActiveUsers = new HashArray('name')
    }
    async callUsers (name) {
        let validation = true
        let currentUser = this.ActiveUsers.get(name)
        let outputdocs
        if (currentUser) {
            console.log("User already in GlobalActiveUser")
        } else {
            const collection = mongotools.db.collection('users')
            await new Promise (resolve => {
                collection.findOne(

                    {'name': name},

                    {_id:1},

                    (err, docs) => {
                        if (err) {
                            console.log('database error')
                            validation = false
                        } else if (docs) {
                            console.log("found user in database")
                            outputdocs = docs
                            console.log(docs)
                        } else {
                            console.log('data not found in record')
                            validation = false
                        }
                        return resolve()
                    }
                )
            })

            if (validation && outputdocs) {
                this.ActiveUsers.add({name: name, data: new OneActiveUserClass(name, outputdocs._id)})
            }
        }
        return validation
    }

    printall_activeuser () {
        console.log(JSON.stringify(this.ActiveUsers,null, 4))
    }

    async get_messages (req) {
        //console.log(JSON.stringify(req.body,null, 4))
        await this.callUsers(req.body.name)

        if (!(await this.callUsers(req.body.name))) {
            console.log("user not found in database")
            return false
        }
        let currentUser = this.ActiveUsers.get(req.body.name).data
        //console.log(currentUser)

        switch (req.body.type) {
            case "toone":
                currentUser.getmessages(req)
                break
            case "others":
                break
        }

    }
    set_messages (res) {

    }

}

let GlobalActiveUser = new GlobalActiveUserClass()
router.post('/heart', async (req, res, next) => {
    await GlobalActiveUser.get_messages(req)


    res.end()
})
router.post('/calluser', async (req, res, next)=>{
    await GlobalActiveUser.callUsers("cheevarit")
    await GlobalActiveUser.callUsers("well")
    await GlobalActiveUser.callUsers("David")
    await GlobalActiveUser.callUsers("Sarah")

    GlobalActiveUser.printall_activeuser()
    res.end()
})



class GlobalRemoteObjectScheduler {

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
        this.setofFulledDeliver = []
        this.setofReceiver = []
        this.tmpDeliver = []

        this.clientchanged = false

        this.maximumDelivingPerNode = 1
        this.activeMembers = new Map()
    }
    Push_Deliver (membername) {
        this.setofDeliver.push({name: membername, weight: 0, ipaddr: "", port: "", sentto: []})
        this.print_Deliver()
    }
    Push_Receiver (membername) {
        this.setofReceiver.push({name: membername, weight: 0, ipaddr: "", port: "", sentto: []})
        this.print_Receiver()
    }
    Distribute_to_Receiver () {
        let iterations = 0
        let currentallweight = this.maximumDelivingPerNode
        while (this.setofReceiver.length !== 0) {
            iterations++
            console.log("iteration : " + iterations)
            if (currentallweight <= 0) {
                currentallweight = 0
                while (this.setofDeliver.length > 0) {
                    this.setofFulledDeliver.push(this.setofDeliver.pop())
                }
                while (this.tmpDeliver.length > 0) {
                    this.setofDeliver.push(this.tmpDeliver.pop())
                    currentallweight += this.maximumDelivingPerNode
                }
            }

            for (let currentdeliver of this.setofDeliver) {
                //console.log("currentdeliver " + JSON.stringify(currentdeliver, null, 4))

                if (this.setofReceiver.length === 0) {
                    break
                }
                if (currentdeliver.weight >= this.maximumDelivingPerNode) {
                    continue
                }
                currentdeliver.weight++
                currentallweight--
                let popReceiver = this.setofReceiver.pop()
                currentdeliver.sentto.push(popReceiver)
                this.tmpDeliver.push(popReceiver)
            }
        }
        console.log("end")
    }
    print_Deliver () {
        //console.log(this.setofDeliver)
        console.log("printing set of Deliver")
        for (let i of this.setofDeliver) {
            console.log(i)
        }
        for (let i of this.setofFulledDeliver) {
            console.log(i)
        }
        for (let i of this.tmpDeliver) {
            console.log(i)
        }
    }
    print_Receiver () {
        let all = ""
        for (let i of this.setofReceiver) {
            all += i.name + " "
        }
        console.log("printing set of Receiver")
        console.log(all)
    }
    SendMessagesToClient () {

    }
    HeartBeatCheck () {

    }


}
let remoteP2P1 = new RemoteDesktopP2PScheduler()



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
router.post('/pushdeli', async (req, res, next) => {
    remoteP2P1.Push_Deliver("A")
    res.end()

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
router.post('/tmp', (req, res, next) => {
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
    res.end()

})
router.post('/printRec', (req, res, next) => {
    remoteP2P1.print_Receiver()
})


router.post('/')
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


router.post('/login', async (req, res, next) => {

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



router.post('/createObjectLinks', async (req, res, next) => {



    let worldname = req.body.worldname
    let positionx = req.body.positionx
    let positiony = req.body.positiony
    let owner_name = req.body.owner_name
    let owner_persisted_id = req.body.owner_persisted_id
    let object_persisted_id = req.body.object_persisted_id

    const world_collection = mongotools.db.collection('worlds')
    const user_collection = mongotools.db.collection('users')
    let validation = true

    //get owner_persisted_id

    await new Promise(resolve => {

        user_collection.findOne(

            {name: req.body.owner_name},

            {_id: 1},

            (err, response) => {
                if (err) {
                    console.log("Error " + err)
                } else {
                    console.log(response)
                    owner_persisted_id = response._id
                }
                return resolve()
            }
        )
    })

    console.log("world name : " + JSON.stringify(req.body, null, 4))


    await new Promise(resolve => {

        world_collection.updateOne(

            {name: req.body.worldname},

            {$push :
                    {
                        "objectlinks": {
                            _id: new ObjectID(),
                            positionx: positionx,
                            positiony: positiony,
                            owner_name: owner_name,
                            owner_persisted_id: owner_persisted_id,
                            object_persisted_id: object_persisted_id
                        }
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
    })

    res.end()


})



router.post('/addToCloudDrive', async (req, res, next) => {
    const collection = mongotools.db.collection('users')
    let validation = true
    let remotedobj_template = {
        persisted_id: "0",
        virtualpath: "\\good\\well",
    }
    await new Promise(resolve => {

        collection.updateOne(

            {name: req.body.name},

            {$push :
                    {
                        "clouddrive.remotedobj": {
                            _id: new ObjectID(),
                            name: req.body.objectname,
                            virtualpath: req.body.vpath
                        }
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
    })
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
