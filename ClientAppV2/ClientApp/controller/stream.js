/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//////////////////////////Requirement Section////////////////////////
/////////////////////////////////////////////////////////////////////
///////**//This code require javascript version 6 or newer//**///////
////////////////////////miscellaneous////////////////////////////////

const chalk = require('chalk')
////////////////////////////From Configs/////////////////////////////

///////////////////////From Other Controllers////////////////////////

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////


//==================================================================================================
//==================================================================================================
//==================================================================================================

class RemoteDesktopFrameBuffer_Class {
    constructor (object_persistedID, ownerID, ownerName) {
        this.object_persistedID = object_persistedID
        this.ownerID = ownerID
        this.ownerName = ownerName

        this.framenumber = 0
        this.timestamp = ""
        this.framebuffer = null


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
    constructor () {
        this.ownerID = ""
        this.ownerName = ""
        this.peers = []
    }
}
class RemoteDesktopStreamMethods_Class {
    DECODE_FrameBuffer (IncomeUDP) {

    }
    ENCODE_FrameBuffer (imagebuffer, predata, postdata) {

    }
}

class FaceImagesStore_Class {

}

module.exports.RemoteDesktopStore_Class = RemoteDesktopStore_Class
module.exports.RemoteDesktopStreamMethods_Class = RemoteDesktopStreamMethods_Class
module.exports.FaceImagesStore_Class = FaceImagesStore_Class