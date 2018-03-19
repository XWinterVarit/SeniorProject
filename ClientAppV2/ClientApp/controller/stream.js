/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//////////////////////////Requirement Section////////////////////////
/////////////////////////////////////////////////////////////////////
///////**//This code require javascript version 6 or newer//**///////
////////////////////////miscellaneous////////////////////////////////

const chalk = require('chalk')
////////////////////////////From Configs/////////////////////////////

const globalConfigs = require('../config/GlobalConfigs')
///////////////////////From Other Controllers////////////////////////

const toolsController = require(globalConfigs.mpath1.toolsController)
const messagesController = require(globalConfigs.mpath1.messagesController)
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////


//==================================================================================================
//==================================================================================================
//==================================================================================================
class OneObjectRemoteDesktop_Class {
    constructor(object_persistedID, ownerID, ownerName) {
        this.RemoteDesktopFrameBuffer = new RemoteDesktopFrameBuffer_Class(object_persistedID, ownerID, ownerName)
        this.RemoteDesktopRedirectTask = new RemoteDesktopRedirectTask(object_persistedID, ownerID, ownerName)
        this.RemoteDesktopRedirectTask.SET_framebufferRef(this.RemoteDesktopFrameBuffer)
    }
    GET_frameBufferController () {
        return this.RemoteDesktopFrameBuffer
    }
    GET_RedirectTaskController () {
        return this.RemoteDesktopRedirectTask
    }

}


class RemoteDesktopFrameBuffer_Class {
    constructor (object_persistedID, ownerID, ownerName) {
        this.type = "framebuffer"

        this.object_persistedID = object_persistedID
        this.ownerID = ownerID
        this.ownerName = ownerName

        this.framenumber = 0
        this.timestamp = ""
        this.framebuffer = null

        this.lock = false

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
    SET_frame (framenumber, framebuffer, timestamp, ownerID, ownername) {
        if (this.ownerID !== ownerID || this.ownerName !== ownername || timestamp <= this.timestamp || framenumber <= this.framenumber || framebuffer == null) {
            console.log("received frame has problem. The system will ignore")
        }
        this.framebuffer = framebuffer
        this.framenumber = framenumber
        this.timestamp = timestamp
    }
    GET_frame () {
        return this.framebuffer
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