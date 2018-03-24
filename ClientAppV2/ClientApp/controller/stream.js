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
    constructor (object_persistedID, ownerID, ownerName) {
        this.type = "framebuffer"

        this.object_persistedID = object_persistedID
        this.ownerID = ownerID
        this.ownerName = ownerName

        this.framenumber = 0
        this.timestamp = ""
        this.framebuffer = null

        this.lock = false

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

    SET_frame (framenumber, framebuffer, timestamp, ownerID, ownername) {
        if (this.lock === false) {
            this.lock = true
            if (this.ownerID !== ownerID || this.ownerName !== ownername || timestamp <= this.timestamp || framenumber <= this.framenumber || framebuffer == null) {
                console.log("received frame has problem. The system will ignore")
            }
            this.framebuffer = framebuffer
            this.framenumber = framenumber
            this.timestamp = timestamp
            this.lock = false
            this.RedirectTaskControllerRef.SIGNAL_send()
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