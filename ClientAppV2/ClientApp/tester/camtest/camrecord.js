const NodeWebCam = require("node-webcam")
const fs = require('fs')
var opts = {

    //Picture related

    width: 1280,

    height: 720,

    quality: 100,


    //Delay to take shot

    delay: 0,


    //Save shots in memory

    saveShots: true,


    // [jpeg, png] support varies
    // Webcam.OutputTypes

    output: "jpeg",


    //Which camera to use
    //Use Webcam.list() for results
    //false for default device

    device: false,


    // [location, buffer, base64]
    // Webcam.CallbackReturnTypes

    callbackReturn: "buffer",


    //Logging

    verbose: false

};
/*
var Webcam = NodeWebCam.create( opts );
Webcam.list( function( list ) {

    //Use another device
    console.log(list)
    //var anotherCam = NodeWebcam.create( { device: list[ 0 ] } );

});
Webcam.capture( "test_picture", function( err, data ) {
    console.log(data.length)
    fs.writeFileSync('./test.jpg', data)
} );
*/
/*
fs.writeFileSync("./test_picture.jpg","")
NodeWebCam.capture( "test_picture", opts, function( err, data ) {
    if (err)
        console.log(err)
    else {
        console.log(data.length)
    }
});
*/
/*
const Webcam = NodeWebCam.create( opts );

Webcam.capture( "test_picture", opts, function( err, data ) {
    console.log(data.length)
});
*/
const memoryFileSystem = require('memory-fs')

const ffmpeg_stream = require('ffmpeg-stream').ffmpeg
const stream = require('stream')

const imagesnap = require('imagesnap');
//var fs = require('fs');
/*
var imageStream = fs.createWriteStream('capture.jpg');
imagesnap().pipe(imageStream);
imageStream.on('finish',()=>{
    console.log("pass")
})
*/
const chalk = require('chalk')
const io = require('socket.io')(40000);
let faceMon = io
    .of('/faceMon')
    .on('connection', (socket) => {
        console.log("peer connect to chat")
        console.log(JSON.stringify(socket.handshake.headers, null, 4))
        socket.on('disconnect', () => {
            console.log("user disconnect")
        })
    })
console.log(chalk.green("Started listener"))

let JPEGCompress = async (preProcessJpeg, indexname) => {
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


let fpscap = (fpscap) => {
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

            if (working === true) {
                framedrop++;
            } else {
                if (framepass > 1000) {
                    console.log("stop screenshot")
                    clearInterval(screenrecords)
                    //toMp4()
                } else {
                    //working = true
                    console.log("start take screenshot")
                    let fsM = new memoryFileSystem()
                    framepass++;
                    console.log(`before framepass ${framepass}`)

                    imagesnap().pipe(fsM.createWriteStream('/capture.jpg')
                        .on('finish',async ()=>{
                            console.log(`framepass ${framepass}`)
                            //console.log(`framepass : ${framepass} new-framedrop ${framedrop - previousframedrop} framedrop : ${framedrop} fps : ${1000/(Date.now() - realtimestamp)}  length: ${framebuffer.length}`)
                            //realtimestamp = Date.now()
                            //working = false
                            let preprocess = fsM.readFileSync('/capture.jpg')
                            let postprocess = await JPEGCompress(preprocess)

                            faceMon.volatile.emit('face', {
                                framenumber: framepass,
                                buffer: postprocess
                            })
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

setTimeout(
    ()=>{
        console.log("start cap")
        fpscap(3)
    }, 2000
)
//fpscap(2)
