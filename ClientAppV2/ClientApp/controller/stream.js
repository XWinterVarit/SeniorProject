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

class RemoteDesktopStore_Class {
    constructor (object_persistedID) {
        this.object_persistedID = object_persistedID
        this.framepass = 0
        this.framebuffer = null

        this.longnonupdate = false
        this.activeCheckSchedule = null
    }
    SET_frame (framenumber, framebuffer) {
        if (framebuffer > this.framepass) {
            this.framebuffer = framebuffer
        } else {
            console.log("ignored previous frame")
        }
    }
    GET_frame () {
        return this.framebuffer
    }
}

class RemoteDesktopStreamMethods_Class {
    DECODE_FrameBuffer (IncomeUDP) {

    }
}

class FaceImagesStore_Class {

}

module.exports.RemoteDesktopStore_Class = RemoteDesktopStore_Class
module.exports.RemoteDesktopStreamMethods_Class = RemoteDesktopStreamMethods_Class
module.exports.FaceImagesStore_Class = FaceImagesStore_Class