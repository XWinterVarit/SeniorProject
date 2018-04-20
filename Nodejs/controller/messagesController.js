/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//////////////////////////Requirement Section////////////////////////
/////////////////////////////////////////////////////////////////////
///////**//This code require javascript version 6 or newer//**///////
////////////////////////miscellaneous////////////////////////////////

const chalk = require('chalk')
const ndarray = require('ndarray')
const AsyncLock = require('async-lock')
const pad = require('pad')

const Client = require('node-rest-client').Client
let client = new Client()
const dgram = require('dgram');

const FormData = require('form-data')
const request = require('request')
const fs = require('fs')
////////////////////////////From Configs/////////////////////////////

const globalConfigs = require('../config/GlobalConfigs')
///////////////////////From Other Controllers////////////////////////

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

//==================================================================================================
//==================================================================================================
//==================================================================================================


const ClientPathTemplated = {
    clientUserGateway: "clientUserGateway",
    clientRemoteGateway: "clientRemoteGateway",
    clientHTTPFrameUpdate: "clientHTTPREMF"
}
class messagesTemplates {
    static BROADCAST_moveUserPosition (name, persistedID, standby, IP, PORT, posX, posY) {
        return {
            type: "update",
            lists: [
                {
                    type: "member",
                    name: name,
                    persistedID: persistedID,
                    positionX: posX,
                    positionY: posY,
                    standby: standby,
                    active: true,
                    IP: IP,
                    PORT: PORT
                }
            ]
        }
    }

    static BROADCAST_moveObjectPosition (subtype, persistedID, owner_name, posX, posY, realobjectID) {
        return {
            type: "update",
            lists: [
                {
                    type: "object",
                    subtype: subtype,
                    persistedID: persistedID,
                    owner_name: owner_name,
                    positionX: posX,
                    positionY: posY,
                    realobjectID: realobjectID
                }
            ]
        }
    }
    static BROADCAST_REFRESH_all (refreshlist) {
        return {
            type: "refresh",
            lists: refreshlist
        }
    }
    static CRAFT_one_user (name, persistedID, standby, IP, PORT, posX, posY) {
        return {
            type: "member",
            name: name,
            persistedID: persistedID,
            positionX: posX,
            positionY: posY,
            standby: standby,
            active: true,
            IP: IP,
            PORT: PORT
        }
    }
    static CRAFT_one_object (subtype, persistedID, owner_name, posX, posY, owner_ID, realobjectID) {
        return {
            type: "object",
            subtype: subtype,
            persistedID: persistedID,
            owner_name: owner_name,
            owner_ID: owner_ID,
            positionX: posX,
            positionY: posY,
            realobjectID: realobjectID
        }
    }

    static CRAFT_one_REMOTE_P2P_TASK (destname, destIP, destPORT) {
        return [
            destname, destIP, destPORT
        ]
        /*
        return {
            destclientname : destname,
            destclientIP : destIP,
            destclientPORT : destPORT,
        }
        */
    }
    static UNICAST_REMOTE_P2P_TASK (tasked_clientname, tasked_clientedID, objectID, objectownername, objectownerID, destclient) {
        return {
            type: "P2PTask",
            taskedclientname: tasked_clientname,
            taskedclientID: tasked_clientedID,
            objectID: objectID,
            objectownername: objectownername,
            objectownerID: objectownerID,
            destclient : destclient
        }
    }

    static BROADCAST_UserOut (username) {
        return {
            type: "remove",
            lists: [
                {
                    type: "member",
                    username: username
                }
            ]
        }
    }
    /* //use moveuser instead
    static BROADCAST_UserIn (lists) {
        return {
            type: "add",
            lists: lists
        }
    }
    */
    static BROADCAST_ObjectOut (persistedID) {
        return {
            type: "remove",
            objectID: persistedID
        }
    }

    static ONE_BUFFERDATA_FORFORMDATA (bufferdata, filename, contentType) {
        return {
            value: bufferdata,
            options: {
                filename: filename,
                contentType: contentType
            }
        }
    }
}

class http_in_queue {
    constructor() {
        this.queue = []
        this.worksSize = 0
        this.LOCK_queue = new AsyncLock()
        this.frozen = false
    }
    ADD_queue (req) {
        this.LOCK_queue.acquire('key', () => {
            this.queue.push(req)
            if (this.worksSize === 0) {
                this.worksSize++
                this.DO_queue()
            } else {
                this.worksSize++
            }
        }).catch(error=>{
            console.log("Lock error : " + error)
        })
    }
    async REDUCE_queue () {
        await this.LOCK_queue.acquire('key', ()=>{
            this.worksSize--
        }).catch(error=>{
            console.log("Lock error : " + error)
        })
    }
    async DO_queue () {
        if (this.frozen) {
            return
        }
        let onequeue
        await this.LOCK_queue.acquire('key', ()=>{
            onequeue = this.queue.shift()
        })
        if (onequeue) {
            console.log("start queue")
            messagesGlobalMethods.httpInput(onequeue)
            await this.REDUCE_queue()
            this.DO_queue()
        } else {
            console.log("queue is now empty")
        }
    }
    PRINT_allqueue () {
        for (let i of this.queue) {
            console.log("show queue")
            console.log(JSON.stringify(i, null, 4))
        }
    }
    DEBUG_frozenqueue () {
        this.frozen = true
    }
    DEBUG_continuequeue () {
        this.frozen = false
        this.DO_queue()
    }
}
class udp_out_queue {
    constructor() {
        this.queue = []
        this.worksSize = 0
        this.LOCK_queue = new AsyncLock()
        this.frozen = false
    }
    async ADD_queue (req) {
        console.log("DEBUG1")
        await this.LOCK_queue.acquire('key2', () => {
            this.queue.push(req)
            console.log("DEBUG2")

            if (this.worksSize === 0) {
                console.log("DEBUG3")

                this.worksSize++
                this.DO_queue()
            } else {
                this.worksSize++
            }
        }).catch(error=>{
            console.log("Lock error : " + error)
        })
    }
    async REDUCE_queue () {
        await this.LOCK_queue.acquire('key2', ()=>{
            this.worksSize--
        }).catch(error=>{
            console.log("Lock error : " + error)
        })
    }
    async DO_queue () {
        if (this.frozen) {
            return
        }
        let onequeue
        await this.LOCK_queue.acquire('key2', ()=>{
            onequeue = this.queue.shift()
        })

        if (onequeue) {
            console.log("start queue")
            await messagesGlobalMethods.udpOutput(onequeue)
            await this.REDUCE_queue()
            this.DO_queue()
        } else {
            console.log("queue is now empty")
        }
    }
    PRINT_allqueue () {
        for (let i of this.queue) {
            console.log("show queue")
            console.log(JSON.stringify(i, null, 4))
        }
    }
    DEBUG_frozenqueue () {
        this.frozen = true
    }
    DEBUG_continuequeue () {
        this.frozen = false
        this.DO_queue()
    }
}
let requestQueue = new http_in_queue()
let udpoutQueue = new udp_out_queue()


class messagesGlobalMethods {
    static httpInputQueue (req) {
        requestQueue.ADD_queue(req)
        //requestQueue.DEBUG_frozenqueue()
        //requestQueue.PRINT_allqueue()
    }
    static async udpOutputQueue (IP, PORT, data) {
        await udpoutQueue.ADD_queue([IP,PORT,data])
        console.log(udpoutQueue.worksSize)
    }
    static httpInput (req) {
        // not implement yet, now it all redirect to userController first.
        /*
        switch (req.body.type) {
            case "update":
                this.updateSession(req.body.lists)
                break
            case "refresh":
                this.refreshSession(req.body.lists)
                break
            case "remove":
                this.removeInSession(req.body.lists)
                break
        }
        */
    }
    static httpOutput_BROADCAST_POST (addressLists,path, data) {
        let args = {
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }
        //console.log(addressLists)
        for (let i of addressLists) {
            if (i[0] === "" || i[1] === "") {
                continue
            }
            console.log(`sent to IP : ${i[0]} PORT : ${i[1]}`)
            client.post("http://" + i[0] + ":" + i[1] +"/" + path, args, (datareturn, response) => {
                console.log(chalk.red(datareturn))
            }).on('error', (err) => {
                console.log("Error " + err)
            })
        }

    }

    /***
     * Old version
     */
    static httpOutput_POST (IP, PORT, path, data) {
        let args = {
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }
        client.post("http://" + IP + ":" + PORT +"/" + path, args, (datareturn, response) => {
            return datareturn
        }).on('error', (err) => {
            console.log("Error " + err)
            return null
        })
    }

    /***
     * Current version
     */
    static async httpOutput_POST_V2withAsync (IP,PORT, path, data) {
        let args = {
            data: data,
            headers: {
                "Content-Type": "application/json"
            }
        }

        return await new Promise(resolve=>{
            client.post("http://" + IP + ":" + PORT +"/" + path, args, (datareturn, response) => {
                return resolve(datareturn)
            }).on('error', (err) => {
                console.log("Error " + err)
                return resolve(null)
            })
        })
    }

    static httpOutput_GET_SERVER (IP, PORT, path) {
        client.get("http://" + IP + ":" + PORT +"/" + path, (datareturn, response) => {
            return datareturn
        }).on('error', (err) => {
            console.log("Error " + err)
            return null
        })
    }



    static formdata_httpOutput_SERVER (path) {

    }

    static formdata_httpOutput_ANY_ONEBuffer (IP, PORT, path, headerdata, bufferdata) {
        let formData = {
            name: "cheevarit",
            bufferdata: bufferdata
        }
        request.post({url:"http://" + IP + ":" + PORT +"/" + path, formData: formData}, (err, httpResponse, body)=>{
            if (err) {
                return console.log("upload fail", err)
            }
            console.log('Upload successful!  Server responded with:', body);
        })
    }


    static async udpOutput (onequeue) {
        let client = dgram.createSocket('udp4');

        client.bind({
            address: 'localhost',
            port: 55555,
            exclusive: true
        })
        //console.log("destination : IP " + onequeue[0] + "  PORT : " + onequeue[1])
        await new Promise(resolve => {
            client.send(onequeue[2], 0, onequeue[2].length, Number(onequeue[1]), onequeue[0], function (err, bytes) {
                if (err) throw err;
                //console.log('UDP message sent to ' + onequeue[0] + ':' + onequeue[1]);
                resolve()
            })
        })
        client.close();
    }

    static async udpOutputV2 (onequeue) {
        let IP = onequeue[0]
        let PORT = onequeue[1]
        let largebuffer = onequeue[2]

        let largebuffer_length = largebuffer.length
        console.log("Buffer length : " + largebuffer_length)
        //let arrayofcuttedbuffer = []
        let currentTime = new Date().getTime()
        let cutlength = 1400 //byte
        let allpiecelength = largebuffer_length % cutlength

        let maximumcutloop = 10000000
        let offset = 0
        let endoffset = 0
        for (let i = 0; i < maximumcutloop; i++) {
            if (largebuffer_length <= 0) {
                break
            }
            if (largebuffer_length < cutlength) {
                endoffset = offset + largebuffer_length
                largebuffer_length = 0
            } else {
                endoffset = offset + Number(cutlength)
                largebuffer_length -= cutlength
            }
            let slicedbuffer = largebuffer.slice(offset, endoffset)
            let header = String(currentTime) + i + "/" + allpiecelength
            let headerlength = pad (2,String(header.length),"0")
            console.log("*" + header)
            console.log(headerlength)
            let allheader = new Buffer(headerlength+header, 'utf-8')
            console.log("**"+allheader.toString())
            let newcombinebuffer = Buffer.concat([allheader,slicedbuffer])
            await this.udpOutput([IP,PORT, newcombinebuffer])
            //arrayofcuttedbuffer.push(slicedbuffer)
            //console.log(slicedbuffer.toString())

            //console.log("isBuffer " + Buffer.isBuffer(slicedbuffer))
            //console.log(`Cutting at offset : ${offset} to : ${endoffset} left : ${largebuffer_length}`)
            offset = endoffset
            /*
            await new Promise(resolve => {
                setTimeout(
                    ()=>{
                        return resolve()
                    },1000
                )
            })
            */
        }
        //return arrayofcuttedbuffer

    }

    static async udpInput (buffer) {
        let newbuffer = Buffer.from(buffer)
        let headerlength = buffer.slice(0,2).toString()
        let header = buffer.slice(2,2+headerlength).toString()
        console.log("Receive headerlength : " + headerlength)
        console.log("Receive header : " + header)
    }

    static largeUDPEncode (largebuffer) {
        let currentTime = new Date().getTime()
        console.log(currentTime)

    }
    static largeUDPDecode () {

    }


    static test (){
        let str = JSON.stringify(incomingMessageTest)
        //console.log(str)
        let obj = JSON.parse(str)
        console.log()
        console.log("show type : " + obj.body.type)
        console.log("show list ")
        for (let i of obj.body.lists) {
            //console.log(i)
            switch (i.type) {
                case "member":
                    sessionController.globalSession.callActiveMember(i.name, i.persistedID, {positionX: i.positionX, positionY: i.positionY, standby: i.standby, IP: i.IP, PORT: i.PORT})
                    break
                case "object":
                    //console.log("IGNORE object")
                    sessionController.globalSession.callObjectLink(i.persistedID, i.owner_name, i.subtype, {positionX: i.positionX, positionY: i.positionY})
                    break
            }
        }
    }
}

module.exports.messagesTemplates = messagesTemplates
module.exports.ClientPathTemplated = ClientPathTemplated
module.exports.messagesGlobalMethods = messagesGlobalMethods