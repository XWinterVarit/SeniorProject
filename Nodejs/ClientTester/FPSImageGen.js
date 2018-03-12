const fs = require('fs')
const screenshot = require('desktop-screenshot')
const screenshot2 = require('screenshot-desktop')
const ffmpeg_stream = require('ffmpeg-stream').ffmpeg
let converter
let input


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