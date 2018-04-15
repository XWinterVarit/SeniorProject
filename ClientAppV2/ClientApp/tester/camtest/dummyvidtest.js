const chalk = require('chalk')
const screenshot2 = require('screenshot-desktop')
const fs = require('fs')
const memoryFileSystem = require('memory-fs')
const stream = require('stream')
const ffmpeg_stream = require('ffmpeg-stream').ffmpeg
const shots = require('azulene-screenshots')


const vid = "./screendummy.mp4"
/*
shots.screenshots(vid, 800).then( async (array_of_buffer) => {
    //console.log(array_of_buffer)
    //fs.writeFileSync('./a.jpg', buffer)
    let j = 0
    for (let i of array_of_buffer) {
        j++
        fs.writeFileSync("./test/"+j+".jpg", i)
        console.log("completed one")
    }
})
*/
let createPreFrame =  async (second, fps)=>{
    let allframe = second * fps

    for (let framepass = 0; framepass <= allframe; framepass++) {
        await new Promise(resolve=>{
            console.log("start at framepass : " + framepass)
            shots.screenshot(vid, Number((Number(framepass)/Number(fps /*fps*/)).toFixed(2))).then( (buffer) => {
                if (buffer.length > 100) {
                    fs.writeFileSync("./test/"+framepass+".jpg", buffer)
                } else {
                    console.log(chalk.red('out of dummy video bound'))
                    framepass = 0
                }
                console.log("completed at framepass : " + framepass)
                return resolve()
            })
        })
    }
}
createPreFrame(60,10)

