const fs = require('fs')
const screenshot = require('desktop-screenshot')
const screenshot2 = require('screenshot-desktop')
const ffmpeg_stream = require('ffmpeg-stream').ffmpeg
let converter
let input

var PORT = 44444;
var HOST = '127.0.0.1';

var dgram = require('dgram');
var message = new Buffer('My KungFu is Good!');
let frame_message = /*fs.readFileSync('./cat.jpg')*/ new Buffer('My KungFu is Good!');
console.log("show length "+frame_message.length)
let async_setTimeout = (syncfunc,waittime) => {
    return new Promise(resolve => {
        setTimeout(
            ()=>{
                syncfunc()
                resolve()
            }, waittime
        )
    })
}
let async_setInterval = (syncfunc,intervaltime) => {
    return new Promise(resolve => {
        setInterval(
            ()=>{
                syncfunc()
                resolve()
            }, intervaltime
        )
    })
}

let frames = []



let test = async () => {

    for (let iteration = 0; iteration < 200; iteration++) {

        for (let i = 0; i < 30; i++) {
            let client = dgram.createSocket('udp4');

            client.bind({
                address: 'localhost',
                port: 55555,
                exclusive: true
            })

            await new Promise(resolve => {
                client.send(frame_message, 0, frame_message.length, PORT, HOST, function (err, bytes) {
                    if (err) throw err;
                    //console.log('UDP message sent to ' + HOST + ':' + PORT);
                    resolve()
                })
            })
            client.close();

            //console.log("Sending : " + i)
        }

            console.log("Finish iteration : " + iteration)
    }


}
let well = async() => {
    await async_setInterval(
        () => {
            console.log("hello")
        }
        ,1000
    )
    console.log("well")
}
//test()
let screen = () => {
    screenshot("screenshot.png", {width:400, quality: 60},function(error, complete) {
        if(error)
            console.log("Screenshot failed", error);
        else
            console.log("Screenshot succeeded");
    });
}

let screen2 = () => {
    screenshot2().then((img)=>{
        fs.writeFileSync('well.jpg', img, (err) => {
            console.log("write file error" + err)
        })
    }).catch((err) => {
        console.log("error " + err);
    })
}
//screen()
//screen2()
let toMp4 = () => {
    console.log("pass1")
    const conv = ffmpeg_stream() // create converter
    console.log("pass2")
    const input = conv.input({f: 'image2pipe', r: 30}) // create input writable stream
    console.log("pass3")
    conv.output('out.mp4', {vcodec: 'libx264', pix_fmt: 'yuv420p'}) // output to file

// for every frame create a function that returns a promise
    console.log("pass4")

    frames.map(filename => () =>
        new Promise((fulfill, reject) =>
            s3
                .getObject({Bucket: '...', Key: filename})
                .createReadStream()
                .on('end', fulfill) // fulfill promise on frame end
                .on('error', reject) // reject promise on error
                .pipe(input, {end: false}) // pipe to converter, but don't end the input yet
        )
    )
    // reduce into a single promise, run sequentially
        .reduce((prev, next) => prev.then(next), Promise.resolve())
        // end converter input
        .then(() => input.end())

    conv.run()
}
let toMp4V2 = () => {
    converter = ffmpeg_stream()
    input = converter.input({f: 'image2pipe', vcodec: 'mjpeg'});
    fs.createReadStream('./well55.jpg').pipe(input)
    converter.output({
        f: 'image2', vcodec: 'mjpeg',
        vf: 'scale=1280:720'
    }).pipe(fs.createWriteStream('./cat_thumb.jpg'))
    converter.run()
}
//toMp4V2()
let fpscap = async (fpscap) => {
    /*
    let times = 1000/fpscap
    console.log("time per frame is : " + times)
    */
    //let buffertest = new BufferedWriter
    let framebuffer = []
    let times = 40;
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
                if (framepass > 300) {
                    console.log("stop screenshot")
                    clearInterval(screenrecords)
                    toMp4()
                } else {
                    working = true
                    console.log("start take screenshot")
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
fpscap(25)


/*
    (function loop(i) {

        const promise = new Promise((resolve, reject) => {



        }).then( () =>{

            if (!queue.isEmpty()){

                console.log('pass')

                loop(i + 1);

            } else {

                console.log(`thread finish with all ${queue.completedWork} task done`)

            }

        }).catch((err)=>{

            console.log('Thread : ' + threadname + ' Has Some Error Happening : ' + err)

        });

    })(0);
*/