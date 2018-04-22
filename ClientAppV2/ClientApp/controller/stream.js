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
const shots = require('azulene-screenshots')
const sharp = require('sharp')
const {spawn} = require('child_process')

let converter
let input

const imagesnap = require('imagesnap')
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
                    //console.log("finish")
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

    static async JPEGCompress_FACE (preProcessJpeg) {
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
                vf: 'scale=320*240', q: '20'
            }).pipe(fsM.createWriteStream('/tempframe')
                .on('finish',()=>{
                    //onsole.log("finish")
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
        this.fpscap = 1
        this.sessionRef = sessionRef

        this.useDummyScreen = true
        this.dummyFileName = "screendummy.mp4" //nolonger use

        this.preload_dummy_framebuffer = []
        this.dummy_framebuffer_folder_path = globalConfigs.testpath1.camtest + "ScreenDummy/"
        this.dummy_framebuffer_maximum_frame = 2000

        this.setCount = 0
        this.passsetCount = 3
        if (this.sessionRef == null) {
            console.log(chalk.red("Desktop Recorder Internal Error"))
        }

        this.Preload_FrameBuffer() // Run automatically
    }
    SET_UserInfo(ownerID, ownerName) {
        this.ownerID = ownerID
        this.ownerName = ownerName
        this.setCount += 2
    }
    SET_remoteObjectID(objectID) {
        this.objectID = objectID
        this.setCount++
    }

    Preload_FrameBuffer () {
        this.preload_dummy_framebuffer = []
        for (let i = 0; i <= this.dummy_framebuffer_maximum_frame; i++) {
            try {
                let framebuffer = fs.readFileSync(this.dummy_framebuffer_folder_path + i + ".jpg")
                this.preload_dummy_framebuffer.push(framebuffer)
                //console.log("preloading at frame : " + i)
            } catch (err) {
                console.log("stopped at frame : " + (i-1))
                //console.log(err)
                break
            }
        }
        console.log(chalk.green("SCREEN RECORD : all frames are : " + this.preload_dummy_framebuffer.length))
    }

    Custom_Preload_FrameBuffer (foldername) {
        this.dummy_framebuffer_folder_path = globalConfigs.testpath1.camtest + "ScreenDummy" + foldername + "/"
        console.log(chalk.bold(this.dummy_framebuffer_folder_path))
        if (fs.existsSync(this.dummy_framebuffer_folder_path) === true) {
            console.log(chalk.bold("Found screen custom preload folder"))
        } else {
            return console.log(chalk.red("can't custom screen preload framebuffer, directory with username not existed"))
        }

        this.preload_dummy_framebuffer = []
        for (let i = 0; i <= this.dummy_framebuffer_maximum_frame; i++) {
            try {
                let framebuffer = fs.readFileSync(this.dummy_framebuffer_folder_path + i + ".jpg")
                this.preload_dummy_framebuffer.push(framebuffer)

                //console.log("preloading at frame : " + i)
            } catch (err) {
                console.log("stopped at frame : " + (i-1))
                //console.log(err)
                break
            }
        }
        console.log(chalk.green("Custom SCREEN RECORD : all frames are : " + this.preload_dummy_framebuffer.length))

    }

    START_RECORD (RemoteObjectRef) {
        if (this.useDummyScreen === true) {
            this.START_RECORD_DUMMY_WITH_PRELOAD_FRAME(RemoteObjectRef)
        } else {
            this.START_RECORD_MAC(RemoteObjectRef)
        }
    }

    START_RECORD_MAC (RemoteObjectRef) {
        if (this.intervalTaken != null) {
            console.log("already start")
            return false
        }
        if (this.setCount < this.passsetCount) {
            console.log("user had not set remote desktop object, ABOARD")
            return false
        }
        this.intervalTaken = "starting.."
        this.stopsignal = false
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

    START_RECORD_DUMMY (RemoteObjectRef) {
        if (this.intervalTaken != null) {
            console.log("already start")
            return false
        }
        if (this.setCount < this.passsetCount) {
            console.log("user had not set remote desktop object, ABOARD")
            return false
        }
        this.intervalTaken = "starting.."
        this.stopsignal = false

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

                    if (framepass > 10000000) {
                        console.log("stop screenshot")
                        clearInterval(this.intervalTaken)
                        working = false
                        this.intervalTaken = null
                        //toMp4()
                    } else {
                        working = true
                        console.log("start take screenshot")

                        const vid = globalConfigs.testpath1.camtest+this.dummyFileName
                        shots.screenshot(vid, Number((Number(framepass)/Number(this.fpscap)).toFixed(2))).then( async (buffer) => {
                            if (buffer.length > 100) {
                                let postprocess = await GlobalStreamUtility.JPEGCompress(buffer, framepass)
                                realtimestamp = Date.now()
                                await RemoteObjectRef.RemoteDesktopFrameBuffer.SET_frame(framepass, postprocess, realtimestamp)
                            } else {
                                console.log(chalk.red('out of dummy video bound'))
                                framepass = 0
                            }
                            working = false
                            //fs.writeFileSync('./a.jpg', buffer)
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

    START_RECORD_DUMMY_WITH_PRELOAD_FRAME (RemoteObjectRef) {

        if (this.intervalTaken != null) {
            console.log(chalk.red("already start"))
            return false
        }

        if (this.preload_dummy_framebuffer == null) {
            console.log(chalk.red("dummy framebuffers have not load yet"))
            return false
        }
        if (this.preload_dummy_framebuffer.length === 0) {
            console.log(chalk.red("dummy framebuffers have not load yet"))
            return false
        }


        if (this.setCount < this.passsetCount) {
            console.log("user had not set remote desktop object, ABOARD")
            return false
        }
        this.intervalTaken = "starting.."
        this.stopsignal = false

        let times = 1000/this.fpscap
        console.log("Starting screenshot taking...")
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

                    if (framepass > 10000000) {
                        console.log("stop screenshot")
                        clearInterval(this.intervalTaken)
                        working = false
                        this.intervalTaken = null
                        //toMp4()
                    } else {
                        working = true
                        //console.log("start take screenshot")

                        if (framepass >= this.preload_dummy_framebuffer.length) {
                            framepass = 0
                        }
                        let framebuffer = this.preload_dummy_framebuffer[framepass]
                        let postprocess = await GlobalStreamUtility.JPEGCompress(framebuffer, framepass)
                        realtimestamp = Date.now()
                        await RemoteObjectRef.RemoteDesktopFrameBuffer.SET_frame(framepass, postprocess, realtimestamp)
                        working = false

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
        console.log(chalk.green("The screen recorder is now stopped"))
        this.stopsignal = true
    }
    BrowserStream_STOP_RECORRD () { // speacial for remote object page

    }
}

class CameraRecorder_Class {
    constructor (sessionRef) {
        this.stopsignal = false
        this.fpscap = 10
        this.sessionRef = sessionRef

        this.intervalTaken = null

        this.OPENCV_USE = false

        this.useDummyFaces = true

        this.SPAWN_OPENCV = null

        this.preload_dummy_framebuffer = []
        this.dummy_framebuffer_folder_path = globalConfigs.testpath1.camtest + "CamDummy/"
        this.dummy_framebuffer_maximum_frame = 2000

        if (this.sessionRef == null) {
            console.log(chalk.red("Desktop Recorder Internal Error"))
        }

        this.Preload_FrameBuffer()

    }

    Preload_FrameBuffer () {
        this.preload_dummy_framebuffer = []
        for (let i = 0; i <= this.dummy_framebuffer_maximum_frame; i++) {
            try {
                let framebuffer = fs.readFileSync(this.dummy_framebuffer_folder_path + i + ".jpg")
                this.preload_dummy_framebuffer.push(framebuffer)
                //console.log("preloading at frame : " + i)
            } catch (err) {
                console.log("stopped at frame : " + (i-1))
                //console.log(err)
                break
            }
        }
        console.log(chalk.green("FACE STREAM : all frames are : " + this.preload_dummy_framebuffer.length))

    }

    Custom_Preload_FrameBuffer (foldername) {
        this.dummy_framebuffer_folder_path = globalConfigs.testpath1.camtest + "CamDummy" + foldername + "/"

        console.log(chalk.bold(this.dummy_framebuffer_folder_path))

        if (fs.existsSync(this.dummy_framebuffer_folder_path) === true) {
            console.log(chalk.bold("Found camera custom preload folder"))
        } else {
            return console.log(chalk.red("can't custom camera preload framebuffer, directory with username not existed"))
        }


        this.preload_dummy_framebuffer=[]
        for (let i = 0; i <= this.dummy_framebuffer_maximum_frame; i++) {
            try {
                let framebuffer = fs.readFileSync(this.dummy_framebuffer_folder_path + i + ".jpg")
                this.preload_dummy_framebuffer.push(framebuffer)

                //console.log("preloading at frame : " + i)
            } catch (err) {
                console.log("stopped at frame : " + (i-1))
                //console.log(err)
                break
            }
        }
        console.log(chalk.green("FACE STREAM : all frames are : " + this.preload_dummy_framebuffer.length))

    }

    START_RECORD (faceframeRef) {
        if (this.OPENCV_USE === true) {
            this.START_RECORD_OPENCV()
        } else {
            if (this.useDummyFaces) {
                this.START_RECORD_DUMMY_WITH_PRELOAD_FRAME(faceframeRef)
            } else {
                this.START_RECORD_MAC(faceframeRef)
            }
        }

    }
    STOP_RECORD () {
        if (this.OPENCV_USE === true) {
            try {
                if (this.SPAWN_OPENCV != null) {
                    this.SPAWN_OPENCV.kill()
                    this.SPAWN_OPENCV.removeAllListeners()
                    this.SPAWN_OPENCV = null
                    console.log(chalk.green("python opencv is killed"))
                    this.intervalTaken = null
                    console.log(chalk.green("STOP OPENCV CAM RECORD"))
                } else {
                    console.log(chalk.yellow("opencv already killed"))
                }
            } catch (e) {
                console.log(chalk.red("******************************"))
                console.log(chalk.red("******************************"))
                console.log(chalk.red("******************************"))
                console.log(chalk.red("******************************"))
                console.log(chalk.red("kill opencv process error : " + e + "  PROCESS HANGUP"))
                this.intervalTaken = null
                console.log(chalk.green("STOP OPENCV CAM RECORD"))
            }


        } else {
            if (this.intervalTaken) {
                clearInterval(this.intervalTaken)
                this.intervalTaken = null
                console.log("stop completed")
            } else {
                console.log("already stoped")
            }
        }




    }
    START_RECORD_OPENCV (faceframeRef) {
        if (this.intervalTaken != null) {
            console.log("already start")
            return false
        }
        try {
            if (this.SPAWN_OPENCV != null) {
                console.log(chalk.red("another opencv is not killed, try killing"))
                this.SPAWN_OPENCV.kill()
                this.SPAWN_OPENCV.removeAllListeners()
                this.SPAWN_OPENCV = null
            }
            this.SPAWN_OPENCV = spawn('python', [globalConfigs.mpath1.condaScriptPath+'opencvcam.py'])
        } catch (e) {
            console.log(chalk.red("******************************"))
            console.log(chalk.red("******************************"))
            console.log(chalk.red("******************************"))
            console.log(chalk.red("******************************"))
            console.log(chalk.red("spawn error : " + e + "  ABORD TASK"))
            return false
        }

        console.log(chalk.green("START OPENCV CAM RECORD"))
        this.intervalTaken = "Taken by OPENCV"

    }
    async SIGNAL_RECORD_OPENCV (faceframeRef, framebuffer) {
        if (this.OPENCV_USE === false) {
            console.log(chalk.red("OpenCV not set to use"))
        }
        if (this.intervalTaken == null) {
            console.log(chalk.red("Record opencv not start"))
            return false
        }

        let preframebuffer = framebuffer
        let postprocess = await GlobalStreamUtility.JPEGCompress_FACE(preframebuffer)
        /*
        await new Promise(resolve=>{
            sharp(postprocess)
                .extract({left: 70, top: 50, width:170, height:170})
                .toBuffer()
                .then((buffer)=>{
                    postprocess = buffer
                    return resolve()
                })
        })
        */

        await faceframeRef.SET_frame(postprocess, true)
    }

    START_RECORD_MAC (faceframeRef) {
        if (this.intervalTaken != null) {
            console.log("already start")
            return false
        }
        console.log(chalk.green("START MAC CAM RECORD"))

        this.intervalTaken = "starting.."

        let times = 1000/this.fpscap
        console.log("time per frame is : " + times)
        let realtimestamp = Date.now()
        console.log(`Start time ${realtimestamp}`)
        let previousframedrop = 0;
        let framedrop = 0;
        let framepass = 0;
        let working = false
        this.intervalTaken = setInterval(
            () => {

                if (working === true) {
                    framedrop++;
                } else {
                    if (framepass > 10000000) {
                        console.log("DEBUG: stop screenshot")
                        clearInterval(this.intervalTaken)
                        //toMp4()
                    } else {
                        //working = true
                        //console.log("start take screenshot")
                        let fsM = new memoryFileSystem()
                        framepass++;
                        //console.log(`before framepass ${framepass}`)

                        imagesnap().pipe(fsM.createWriteStream('/capture.jpg')
                            .on('finish',async ()=>{
                                console.log(`framepass ${framepass}`)
                                //console.log(`framepass : ${framepass} new-framedrop ${framedrop - previousframedrop} framedrop : ${framedrop} fps : ${1000/(Date.now() - realtimestamp)}  length: ${framebuffer.length}`)
                                //realtimestamp = Date.now()
                                //working = false
                                let preprocess = fsM.readFileSync('/capture.jpg')
                                let postprocess = await GlobalStreamUtility.JPEGCompress_FACE(preprocess)

                                faceframeRef.SET_frame(postprocess, true)
                                //this.sessionRef.MONITOR_FACESTREAMING_SOCKETIO(postprocess)



                            }));

                        /*
                                            imagesnap().pipe(fsM.createWriteStream('/capture.jpg')
                                                .on('finish',async ()=>{
                                                    console.log(`framepass ${framepass}`)
                                                    //console.log(`framepass : ${framepass} new-framedrop ${framedrop - previousframedrop} framedrop : ${framedrop} fps : ${1000/(Date.now() - realtimestamp)}  length: ${framebuffer.length}`)
                                                    //realtimestamp = Date.now()
                                                    //working = false
                                                    let preprocess = fsM.readFileSync('/capture.jpg')
                                                    let postprocess = await JPEGCompress(preprocess)
                                                    fs.writeFileSync('compress'+framepass+'.jpg', postprocess)

                                                }));
                        */

                        /*
                                            var imageStream = fs.createWriteStream('capture'+framepass+'.jpg');
                                            imagesnap().pipe(imageStream
                                                .on('finish',()=>{
                                                    console.log(`after framepass ${framepass}`)
                                                    //console.log(`framepass : ${framepass} new-framedrop ${framedrop - previousframedrop} framedrop : ${framedrop} fps : ${1000/(Date.now() - realtimestamp)}  length: ${framebuffer.length}`)
                                                    //realtimestamp = Date.now()
                                                    //working = false
                                                }));
                                            */

                    }
                }
            }, times
        )

    }
    START_RECORD_WINDOWS () {

    }

    START_RECORD_DUMMY (faceframeRef) {
        if (this.intervalTaken != null) {
            console.log("already start")
            return false
        }

        this.intervalTaken = "starting.."

        let times = 1000/this.fpscap
        console.log("time per frame is : " + times)
        let realtimestamp = Date.now()
        console.log(`Start time ${realtimestamp}`)
        let previousframedrop = 0;
        let framedrop = 0;
        let framepass = 0;
        let working = false
        this.intervalTaken = setInterval(
            async () => {

                if (working === true) {
                    framedrop++;
                } else {
                    if (framepass > 10000000) {
                        console.log("DEBUG: stop screenshot")
                        clearInterval(this.intervalTaken)
                        //toMp4()
                    } else {
                        //working = true
                        //console.log("start take screenshot")
                        framepass++;
                        const vid = globalConfigs.testpath1.camtest + 'testcam.mp4'
                        shots.screenshot(vid, Number((Number(framepass)/Number(this.fpscap)).toFixed(2))).then( async (buffer)=>{
                            if (buffer.length > 100) {
                                let postprocess = await GlobalStreamUtility.JPEGCompress_FACE(buffer)
                                await faceframeRef.SET_frame(postprocess, true)
                            } else {
                                console.log(chalk.red('out of dummy video bound'))
                                framepass = 0
                            }
                            working = false
                            //fs.writeFileSync('./a.jpg', buffer)
                        })

                    }
                }
            }, times
        )

    }

    START_RECORD_DUMMY_WITH_PRELOAD_FRAME (faceframeRef) {
        console.log(chalk.green("START DD PREREC CAM RECORD"))

        if (this.intervalTaken != null) {
            console.log("already start")
            return false
        }

        if (this.preload_dummy_framebuffer == null) {
            console.log(chalk.red("dummy framebuffers have not load yet"))
            return false
        }
        if (this.preload_dummy_framebuffer.length === 0) {
            console.log(chalk.red("dummy framebuffers have not load yet"))
            return false
        }

        this.intervalTaken = "starting.."

        let times = 1000/this.fpscap
        console.log("time per frame is : " + times)
        let realtimestamp = Date.now()
        console.log(`Start time ${realtimestamp}`)
        let previousframedrop = 0;
        let framedrop = 0;
        let framepass = 0;
        let working = false
        this.intervalTaken = setInterval(
            async () => {
                framepass++;

                if (working === true) {
                    framedrop++;
                } else {
                    if (framepass > 10000000) {
                        console.log("DEBUG: stop screenshot")
                        clearInterval(this.intervalTaken)
                        //toMp4()
                    } else {
                        working = true
                        //console.log("start take screenshot")

                        if (framepass >= this.preload_dummy_framebuffer.length) {
                            framepass = 0
                        }
                        let framebuffer = this.preload_dummy_framebuffer[framepass]
                        let postprocess = await GlobalStreamUtility.JPEGCompress_FACE(framebuffer, framepass)

                        await new Promise(resolve=>{
                            sharp(postprocess)
                                .extract({left: 70, top: 50, width:170, height:170})
                                .toBuffer()
                                .then((buffer)=>{
                                    postprocess = buffer
                                    return resolve()
                                })
                        })

                        await faceframeRef.SET_frame(postprocess, true)
                        working = false

                    }
                }
            }, times
        )


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
        this.maximum_time_allow_get_frame = 3000 //ms
        this.framebuffer = null

        this.debugFrame = false
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
            //console.log(chalk.green("SET FRAME DEBUG 1"))

            this.framebuffer = framebuffer
            this.framenumber = framenumber
            this.timestamp = timestamp
            /*
            if (this.debugFrame === true) {
                console.log('emit to websocket')
                this.sessionRef.MONITOR_REMOTEFRAME_SOCKETIO(framebuffer, framenumber, timestamp)
            }
            */
  /*
            if (this.redirecttodisplay === true) {
                this.sessionRef.FORUI_DISPLAY_VIA_SOCKETIO(framebuffer)
            }
*/
            this.lock = false


            await this.RedirectTaskControllerRef.SIGNAL_passthrough_send(framebuffer, framenumber, timestamp)
            console.log(chalk.green("SET FRAME DEBUG 2"))

        } else {
            console.log("can't set frame due to the other operation is operate on frame")
        }
    }
    GET_frame () {
        let now_timestamp = Date.now()
        if (now_timestamp - this.timestamp < this.maximum_time_allow_get_frame) {
            return this.framebuffer
        } else {
            return null
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
    GET_PEERS_LENGTH () {
        return this.peers.length
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
        //console.log(chalk.green("SIGNAL_Passthrough_Send is called"))
        const messagesController = require(globalConfigs.mpath1.messagesController)
        //console.log(chalk.green(messagesController.ClientPathTempleted.clientHTTPFrameUpdate))
        if (!framebuffer) {
            console.log(chalk.red("not receive frame buffer"))
            return false
        }
        //let count = 0
        if (this.RemoteDesktopFrameBuffer.lock === false) {
            //console.log(chalk.green("LOCK FRAME"))
            this.RemoteDesktopFrameBuffer.lock = true
            for (let i of this.peers) {
                let name = i[0]
                let IP = i[1]
                let PORT = i[2]

                //console.log(`senting to peers : name : ${name} IP : ${IP} PORT : ${PORT} `)
                //console.log(messagesController.ClientPathTemplated)
                //console.log(chalk.green(messagesController.ClientPathTempleted.clientHTTPFrameUpdate))
                //messagesController.messagesGlobalMethods.requireTest()
                //console.log(chalk.yellow(`Special debug for stream sending system | name : ${name} objectID : ${this.object_persistedID} framenumber : ${frameNumber} ownerID : ${this.ownerID} ownername : ${this.ownerName} \n timestamp : ${timeStamp}`))

                await messagesController.messagesGlobalMethods.formdata_httpOutput_ANY_ONEBuffer(IP,PORT
                    , messagesController.ClientPathTempleted.clientHTTPFrameUpdate
                    , messagesController.messagesTemplates.UNICAST_UPDATEFRAME_HEADER_FORMDATA(name, this.object_persistedID, frameNumber, this.ownerID, this.ownerName, timeStamp)
                    , messagesController.messagesTemplates.ONE_BUFFERDATA_FORFORMDATA(framebuffer,"frame", messagesController.messagesTemplates_ClientPathTempleted.application_any))

            }
            //console.log(chalk.green("UNLOCK FRAME"))
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


class OneFaceImagesStore_Class {
    constructor(user_name, sessionRef) {
        this.type = "face_framebuffer"

        this.user_name = user_name
        this.framebuffer = null

        this.debugFrame = false
        this.lock = false

        this.sessionRef = sessionRef

        this.TIMESTAMP_setframe = 0
        this.maximum_time_allow_get_frame = 3000 //milisec

    }
    async SET_frame (framebuffer, isOwner) {

        if (this.lock === false) {
            //console.log(chalk.red('***************'))
            this.lock = true

            this.TIMESTAMP_setframe = Date.now()
            this.framebuffer = framebuffer
            if (this.debugFrame === true) {
                //console.log('emit to websocket')
                this.sessionRef.MONITOR_FACESTREAMING_SOCKETIO(framebuffer)
            }
            if (isOwner === true) {
                this.Redirect_Sent(framebuffer)
            }
            this.lock = false
        } else {
            console.log("can't set frame due to the other operation is operate on frame")
        }
    }
    GET_frame() {
        let now_timestamp = Date.now()
        //console.log('getting frame')
        if (now_timestamp - this.TIMESTAMP_setframe < this.maximum_time_allow_get_frame) {
            //console.log(chalk.green('sent new frame'))
            return this.framebuffer
        } else {
            return null
        }
    }
    Redirect_Sent (framebuffer) {
        if (!framebuffer) {
            console.log(chalk.red("not receive frame buffer"))
            return false
        }
        //console.log('senting..')
        const messagesController = require(globalConfigs.mpath1.messagesController)

        for (let i of this.sessionRef.CurrentNearbyUserLists) {
            if (i.name !== this.sessionRef.currentUser_name) {
                let IP = i.IP
                let PORT = i.PORT
                messagesController.messagesGlobalMethods.formdata_httpOutput_ANY_ONEBuffer(
                    IP,
                    PORT,
                    messagesController.ClientPathTempleted.clientHTTPFaceFrameUpdate,
                    messagesController.messagesTemplates.UNICAST_UPDATEFACE_HEADER_FORMDATA(this.sessionRef.active_at_world_persistedID, i.name, this.sessionRef.currentUser_name),
                    messagesController.messagesTemplates.ONE_BUFFERDATA_FORFORMDATA(framebuffer, "frame", messagesController.messagesTemplates_ClientPathTempleted.application_any)
                )
            } else {
                //console.log(chalk.yellow('ignore sent to ourself'))
            }
        }
    }
}



module.exports.RemoteDesktopStreamMethods_Class = RemoteDesktopStreamMethods_Class
module.exports.OneFaceImagesStore_Class = OneFaceImagesStore_Class
module.exports.OneObjectRemoteDesktop_Class = OneObjectRemoteDesktop_Class
module.exports.GlobalStreamUtility = GlobalStreamUtility
module.exports.DesktopRecorder_Class = DesktopRecorder_Class
module.exports.CameraRecorder_Class = CameraRecorder_Class