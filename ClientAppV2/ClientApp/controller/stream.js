/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//////////////////////////Requirement Section////////////////////////
/////////////////////////////////////////////////////////////////////
///////**//This code require javascript version 6 or newer//**///////
////////////////////////miscellaneous////////////////////////////////

const chalk = require('chalk')
const screenshot2 = require('screenshot-desktop')
const fs = require('fs')
const memoryFileSystem = require('memory-fs')
const stream = require('stream')
const ffmpeg_stream = require('ffmpeg-stream').ffmpeg
let converter
let input
////////////////////////////From Configs/////////////////////////////

const globalConfigs = require('../config/GlobalConfigs')
///////////////////////From Other Controllers////////////////////////

const toolsController = require(globalConfigs.mpath1.toolsController)
//const messagesController = require(globalConfigs.mpath1.messagesController)
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////


//==================================================================================================
//==================================================================================================
//==================================================================================================

class GlobalStreamUtility {
    static fpscap (fpscap) {

        let times = 1000/fpscap
        console.log("time per frame is : " + times)

        //let buffertest = new BufferedWriter
        let framebuffer = []
        //let times = 40;
        let realtimestamp = Date.now()
        console.log(`Start time ${realtimestamp}`)
        let previousframedrop = 0;
        let framedrop = 0;
        let framepass = 0;
        let working = false
        let screenrecords = setInterval(
            () => {
                framepass++;
                if (working === true) {
                    framedrop++;
                } else {
                    if (framepass > 1000) {
                        console.log("stop screenshot")
                        clearInterval(screenrecords)
                        //toMp4()
                    } else {
                        working = true
                        console.log("start take screenshot")
  /*
                        screenshot2().then((img)=>{
                            let framefilename = 'well' + framepass + '.jpg'
                            frames.push(framefilename)

                            fs.writeFileSync(framefilename, img, (err) => {
                                console.log("write file error" + err)
                            })

                            //framebuffer.push(img)
                            console.log(`framepass : ${framepass} new-framedrop ${framedrop - previousframedrop} framedrop : ${framedrop} fps : ${1000/(Date.now() - realtimestamp)}  length: ${framebuffer.length}`)
                            realtimestamp = Date.now()
                            working = false
                        }).catch((err) => {
                            console.log("error " + err);
                        })
*/
                        /*
                        setTimeout(
                            () => {
                                console.log(`framepass : ${framepass} new-framedrop ${framedrop - previousframedrop} framedrop : ${framedrop} fps : ${1000/(Date.now() - realtimestamp)}`)
                                working = false
                                realtimestamp = Date.now()
                            }
                            ,80
                        )
                        */

                    }
                }
            }, times
        )

    }
    static test () {
        console.log("testestest")
    }
    static async JPEGCompress (preProcessJpeg, indexname) {
        let fsM = new memoryFileSystem()
        let converter
        let input

        converter = ffmpeg_stream()

        await new Promise((resolve, reject)=>{

            input = converter.input({f: 'image2pipe', vcodec: 'mjpeg'});

            //let buffer = fs.readFileSync('./well15.jpg')
            let bufferStream = new stream.PassThrough()
            bufferStream.end(preProcessJpeg)


            //fs.createReadStream('./well15.jpg').pipe(input)
            bufferStream.pipe(input)
            converter.output({
                f: 'image2', vcodec: 'mjpeg',
                vf: 'scale=1920*1080', q: '30'
            }).pipe(fsM.createWriteStream('/tempframe')
                .on('finish',()=>{
                    console.log("finish")

                    return resolve()

                }).on('error',()=>{
                    console.log("stream error")
                    return reject()
                }))

            converter.run()
        })
        //let temp = fsM.readFileSync('/tempframe')
        return fsM.readFileSync('/tempframe')

        //fs.writeFileSync(globalConfigs.testpath1.data+"balls"+indexname+".jpg", temp)
    }
}


class DesktopRecorder_Class {
    constructor (sessionRef) {
        console.log("DesktopRecorder_Initialize")
        this.intervalTaken = null
        this.stopsignal = false
        this.fpscap = 15
        this.sessionRef = sessionRef

        this.setCount = 0
        this.passsetCount = 3
        if (this.sessionRef == null) {
            console.log(chalk.red("Desktop Recorder Internal Error"))
        }
    }
    SET_UserInfo(ownerID, ownerName) {
        this.ownerID = ownerID
        this.ownerName = ownerName
        this.setCount+=2
    }
    SET_remoteObjectID(objectID) {
        this.objectID = objectID
        this.setCount++
    }


    START_RECORD (RemoteObjectRef) {
        if (this.intervalTaken != null) {
            console.log("already start")
            return false
        }
        if (this.setCount < this.passsetCount) {
            console.log("user had not set remote desktop object, ABOARD")
            return false
        }
        this.intervalTaken = "starting.."
        let times = 1000/this.fpscap
        console.log("time per frame is : " + times)

        //let buffertest = new BufferedWriter
        let framebuffer = []
        //let times = 40;
        let realtimestamp = Date.now()
        console.log(`Start time ${realtimestamp}`)
        let previousframedrop = 0;
        let framedrop = 0;
        let framepass = 0;
        let working = false
        this.intervalTaken = setInterval(
            async () => {
                if (this.stopsignal === true) {
                    clearInterval(this.intervalTaken)
                    this.intervalTaken = null
                    console.log("stop interval completed")
                    this.stopsignal = false
                }

                framepass++
                //console.log("pass interval : working " + working)

                if (working === true) {
                    //console.log("framedropped")
                    framedrop++;
                } else {

                    if (framepass > 10000) {
                        console.log("stop screenshot")
                        clearInterval(this.intervalTaken)
                        working = false
                        this.intervalTaken = null
                        //toMp4()
                    } else {
                        working = true
                        console.log("start take screenshot")

                                screenshot2().then(async (img)=>{
                                    let framefilename = 'well' + framepass + '.jpg'
                                    //frames.push(framefilename)
                                    /*
                                    fs.writeFileSync(globalConfigs.testpath1.data + framefilename, img, (err) => {
                                        console.log("write file error" + err)
                                    })*/
                                    let buffer = await GlobalStreamUtility.JPEGCompress(img,framepass)
                                    //let buffer = img
                                    //this.sessionRef.TEST_MONITOR_SOCKETIO(buffer)
                                    //framebuffer.push(img)
                                    //console.log(`framepass : ${framepass} new-framedrop ${framedrop - previousframedrop} framedrop : ${framedrop} fps : ${1000/(Date.now() - realtimestamp)}  length: ${framebuffer.length}`)
                                    realtimestamp = Date.now()

                                    await RemoteObjectRef.RemoteDesktopFrameBuffer.SET_frame(framepass, buffer,realtimestamp)
                                    working = false
                                }).catch((err) => {
                                    console.log("error " + err);
                                })

                        /*
                        setTimeout(
                            () => {
                                console.log(`framepass : ${framepass} new-framedrop ${framedrop - previousframedrop} framedrop : ${framedrop} fps : ${1000/(Date.now() - realtimestamp)}`)
                                working = false
                                realtimestamp = Date.now()
                            }
                            ,80
                        )
                        */
                    }
                }
            }, times
        )

    }
    STOP_RECORD () {
        this.stopsignal = true
    }
}


class OneObjectRemoteDesktop_Class {
    constructor(object_persistedID, ownerID, ownerName, sessionRef) {
        this.RemoteDesktopFrameBuffer = new RemoteDesktopFrameBuffer_Class(object_persistedID, ownerID, ownerName, sessionRef)
        this.RemoteDesktopRedirectTask = new RemoteDesktopRedirectTask(object_persistedID, ownerID, ownerName)
        this.RemoteDesktopRedirectTask.SET_framebufferRef(this.RemoteDesktopFrameBuffer)
        this.RemoteDesktopFrameBuffer.SET_RedirectTaskRef(this.RemoteDesktopRedirectTask)
    }
    GET_frameBufferController () {
        return this.RemoteDesktopFrameBuffer
    }
    GET_RedirectTaskController () {
        return this.RemoteDesktopRedirectTask
    }

}


class RemoteDesktopFrameBuffer_Class {
    constructor (object_persistedID, ownerID, ownerName, sessionRef) {
        this.type = "framebuffer"

        this.object_persistedID = object_persistedID
        this.ownerID = ownerID
        this.ownerName = ownerName

        this.framenumber = 0
        this.timestamp = ""
        this.framebuffer = null

        this.debugFrame = true
        this.redirecttodisplay = false


        this.lock = false

        this.sessionRef = sessionRef

        this.RedirectTaskControllerRef = null

        this.TEMPLATE_udpframebuffer = class {
            constructor (framenumber, timestamp, object_persistedID, ownerID, ownerName, framebuffer) {
                this.stricttag = "TEMPLATE_udpframebuffer"

                this.framenumber = String(framenumber)
                this.timestamp = timestamp
                this.object_persistedID = object_persistedID
                this.ownerID = ownerID
                this.ownerName = ownerName
                this.framebuffer = framebuffer
            }
            GET_ArrayofData () {
                return [
                    this.framenumber, this.timestamp, this.object_persistedID, this.ownerID, this.ownerName, this.framebuffer
                ]
            }
        }
    }
    SET_RedirectTaskRef (Ref) {
        this.RedirectTaskControllerRef = Ref
    }

    async SET_frame (framenumber, framebuffer, timestamp) {
        if (this.lock === false) {
            this.lock = true
            if ( timestamp <= this.timestamp /*|| framenumber <= this.framenumber*/ || framebuffer == null) {
                console.log("received frame has problem. The system will ignore")
                this.lock = false
                return false
            }
            console.log(chalk.green("SET FRAME DEBUG 1"))

            this.framebuffer = framebuffer
            this.framenumber = framenumber
            this.timestamp = timestamp
            if (this.debugFrame === true) {
                console.log('emit to websocket')
                this.sessionRef.MONITOR_REMOTEFRAME_SOCKETIO(framebuffer, framenumber, timestamp)
            }
            if (this.redirecttodisplay === true) {
                this.sessionRef.FORUI_DISPLAY_VIA_SOCKETIO(framebuffer)
            }

            this.lock = false


            await this.RedirectTaskControllerRef.SIGNAL_passthrough_send(framebuffer, framenumber, timestamp)
            console.log(chalk.green("SET FRAME DEBUG 2"))

        } else {
            console.log("can't set frame due to the other operation is operate on frame")
        }
    }
    GET_frame () {
        return {
            framebuffer : this.framebuffer,
            framenumber : this.framenumber
        }
    }
}

class RemoteDesktopRedirectTask {
    constructor (object_persistedID, ownerID, ownerName) {
        this.object_persistedID = object_persistedID
        this.ownerID = ownerID
        this.ownerName = ownerName
        this.peers = []

        this.RemoteDesktopFrameBuffer = null
    }
    SET_framebufferRef (framebufferObjectRef) {
        this.RemoteDesktopFrameBuffer = framebufferObjectRef
    }
    REFRESH_PEERS (peers) {
        this.peers = peers
    }

    STOP_send() {

    }
    SIGNAL_send() {
        if (this.RemoteDesktopFrameBuffer.lock === false) {
            this.RemoteDesktopFrameBuffer.lock = true
            for (let i of this.peers) {
                let name = i[0]
                let IP = i[1]
                let PORT = i[2]

                let getedFrame = this.RemoteDesktopFrameBuffer.GET_frame()
                let frameBuffer = getedFrame.framebuffer
                let frameNumber = getedFrame.framenumber

                console.log(`senting to peers : name : ${name} IP : ${IP} PORT : ${PORT} `)
                messagesController.messagesGlobalMethods.formdata_httpOutput_ANY_ONEBuffer(IP,PORT
                    , messagesController.ClientPathTemplated.clientHTTPFrameUpdate
                    , messagesController.messagesTemplates.UNICAST_UPDATEFRAME_HEADER_FORMDATA(this.object_persistedID,frameNumber, this.ownerID, this.ownerName)
                    , messagesController.messagesTemplates.ONE_BUFFERDATA_FORFORMDATA(frameBuffer,"frame", messagesController.messagesTemplates_ClientPathTempleted.application_any))
            }
            this.RemoteDesktopFrameBuffer.lock = false
        } else {
            console.log("buffer locking due to not completed sent")
        }
    }
    async SIGNAL_passthrough_send(framebuffer, frameNumber, timeStamp) {
        console.log(chalk.green("SIGNAL_Passthrough_Send is called"))
        const messagesController = require(globalConfigs.mpath1.messagesController)
        //console.log(chalk.green(messagesController.ClientPathTempleted.clientHTTPFrameUpdate))
        if (!framebuffer) {
            console.log(chalk.red("not receive frame buffer"))
            return false
        }
        //let count = 0
        if (this.RemoteDesktopFrameBuffer.lock === false) {
            console.log(chalk.green("LOCK FRAME"))
            this.RemoteDesktopFrameBuffer.lock = true
            for (let i of this.peers) {
                let name = i[0]
                let IP = i[1]
                let PORT = i[2]

                console.log(`senting to peers : name : ${name} IP : ${IP} PORT : ${PORT} `)
                //console.log(messagesController.ClientPathTemplated)
                console.log(chalk.green(messagesController.ClientPathTempleted.clientHTTPFrameUpdate))
                //messagesController.messagesGlobalMethods.requireTest()

                await messagesController.messagesGlobalMethods.formdata_httpOutput_ANY_ONEBuffer(IP,PORT
                    , messagesController.ClientPathTempleted.clientHTTPFrameUpdate
                    , messagesController.messagesTemplates.UNICAST_UPDATEFRAME_HEADER_FORMDATA(name, this.object_persistedID, frameNumber, this.ownerID, this.ownerName, timeStamp)
                    , messagesController.messagesTemplates.ONE_BUFFERDATA_FORFORMDATA(framebuffer,"frame", messagesController.messagesTemplates_ClientPathTempleted.application_any))

            }
            console.log(chalk.green("UNLOCK FRAME"))
            this.RemoteDesktopFrameBuffer.lock = false
        } else {
            console.log("buffer locking due to not completed sent")
        }
    }
    MONITOR () {
        let messages = ""
        messages += `Monitor Redirect Remote Frame : objectID ${this.object_persistedID}  ownerID ${this.ownerID}   ownerName ${this.ownerName}\n`
        messages += `peers list : \n`
        messages += this.peers.toString()
        /*
        for (let i of this.peers) {
            messages += i + '\n'
        }
        */
        return messages
    }

}
class RemoteDesktopStreamMethods_Class {
    DECODE_FrameBuffer (IncomeUDP) {
        return toolsController.BufferUtility.extractbuffer(IncomeUDP)
    }
    ENCODE_FrameBuffer (frameTemplated) {
        if (!toolsController.StrictTagUtility.checkTag(frameTemplated, "TEMPLATE_udpframebuffer")) {
            return null
        }
        return toolsController.BufferUtility.createBuffer(frameTemplated.GET_ArrayofData())
    }
}

class FaceImagesStore_Class {

}



module.exports.RemoteDesktopStreamMethods_Class = RemoteDesktopStreamMethods_Class
module.exports.FaceImagesStore_Class = FaceImagesStore_Class
module.exports.OneObjectRemoteDesktop_Class = OneObjectRemoteDesktop_Class
module.exports.GlobalStreamUtility = GlobalStreamUtility
module.exports.DesktopRecorder_Class = DesktopRecorder_Class