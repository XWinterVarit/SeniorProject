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




class WorldMethods {

    static async addMember (req, res) {
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
    }

    static async acceptMember (req, res) {
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

    }

    static async createWorld (req, res) {
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
    }

}