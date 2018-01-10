router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

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
router.get('/monitor', (req, res, next) => {
    GlobalActiveUser.monitor_activeuser(res)
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


class LinksObject {
    constructor (realobject_persisted_id, persisted_id ,name) {
        this.positionx = 0
        this.positiony = 0
        this.realobject_persisted_id = realobject_persisted_id
        this.persisted_id = persisted_id

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

})
router.post('/acceptMemberInvitation', async (req, res, next) => {


})
router.post('/createNewWorld', async (req, res, next) => {




})

router.post('/createNewUsers', async (req, res, next) => {

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




router.post('/editWorld', async(req, res, next) => {

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
