var Ffmpeg = require('fluent-ffmpeg');
const memoryFileSystem = require('memory-fs')

const fs = require('fs')

let fsM = new memoryFileSystem()

var ffinst = Ffmpeg('./testcam.mp4');

let outstream = fsM.createWriteStream('/test.png')

/*
ffinst.screenshots({
    timestamps: [1],
    size: '320x240'
}).pipe(outstream)
*/

const shots = require('azulene-screenshots')


/*
shots.writeScreenshots(vid, 'x', 1,'./').then(()=>{
    console.log('completed')
})
*/

const vid = './testcam.mp4'
shots.screenshot(vid, 1).then( (buffer)=>{
    if (buffer.length > 100) {
        fs.writeFileSync('./a.jpg', buffer)
    } else {
        return null
    }
})
