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
export default class One_Scheduler_RemoteDesktopP2P {
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
export default class Group_RemoteDesktop  {
    constructor () {
        this.RemoteDesktopP2PScheduler = new HashArray('id')
        this.Debug_RemoteDesktopP2PScheduler = []
    }
}

