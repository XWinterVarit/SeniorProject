const mic = require('mic')
const fs = require('fs')
const play = require('audio-play')
const load = require('audio-loader')
const Speaker = require('speaker')
const volume = require('pcm-volume')
var createBuffer = require('audio-buffer-from')
const speaker = new Speaker({
    channels: 2,          // 2 channels
    bitDepth: 16,         // 16-bit samples
    sampleRate: 44100     // 44,100 Hz sample rate
})
const speaker2 = new Speaker({
    channels: 2,          // 2 channels
    bitDepth: 16,         // 16-bit samples
    sampleRate: 44100     // 44,100 Hz sample rate
})
const memoryFileSystem = require('memory-fs')


let micInstance =  mic({
    rate: '44100',
    channels: '2',
    debug: false,
});
let micInputStream = micInstance.getAudioStream()

let v = new volume()
v.setVolume(0.1)






    micInputStream.on('data', function(data) {
        console.log("Recieved Input Stream: " + data.length);
    });

    micInputStream.on('error', function(err) {
        cosole.log("Error in Input Stream: " + err);
    });

    micInputStream.on('startComplete', function() {
        console.log("Got SIGNAL startComplete");
    });

    micInputStream.on('stopComplete', function() {
        console.log("Got SIGNAL stopComplete");
    });

    micInputStream.on('pauseComplete', function() {
        console.log("Got SIGNAL pauseComplete");
    });

    micInputStream.on('resumeComplete', function() {
        console.log("Got SIGNAL resumeComplete");
    });

    micInputStream.on('silence', function() {
        console.log("Got SIGNAL silence");
    });

    micInputStream.on('processExitComplete', function() {
        console.log("Got SIGNAL processExitComplete");
    });

    let test = async () => {
        let fsM = new memoryFileSystem()
        let outputFileStream = fsM.createWriteStream('/mic.raw')
        micInputStream.pipe(outputFileStream)
        micInstance.start()
        await new Promise(resolve=>{
            setTimeout(
                async ()=>{
                    micInstance.pause()
                    //fsM.createReadStream('/mic.raw').pipe(speaker)
                    const speaker55 = new Speaker({
                        channels: 2,          // 2 channels
                        bitDepth: 16,         // 16-bit samples
                        sampleRate: 44100     // 44,100 Hz sample rate
                    })
                    let channal1 = fsM.createReadStream('/mic.raw')
                    channal1.pipe(speaker55).on('finish', ()=>{
                        console.log("pipe end")
                        let buffer = fsM.readFileSync('/mic.raw')
                        console.log("buffer size : " + buffer.length)
                        return resolve()
                    })
                },10000
            )
        })
        console.log("restart recording")
        fsM = new memoryFileSystem()
        outputFileStream = fsM.createWriteStream('/mic.raw')
        micInputStream = micInstance.getAudioStream()

        micInputStream.pipe(outputFileStream)
        micInstance.resume()
        await new Promise(resolve=>{
            setTimeout(
                async ()=>{
                    micInstance.pause()
                    //fsM.createReadStream('/mic.raw').pipe(speaker)
                    const speaker55 = new Speaker({
                        channels: 2,          // 2 channels
                        bitDepth: 16,         // 16-bit samples
                        sampleRate: 44100     // 44,100 Hz sample rate
                    })
                    let channal1 = fsM.createReadStream('/mic.raw')
                    channal1.pipe(speaker55).on('finish', ()=>{
                        console.log("pipe end")
                        return resolve()
                    })
                },3000
            )
        })

    }
    test()







  /*
    setInterval(
        ()=>{

            const speaker55 = new Speaker({
                channels: 2,          // 2 channels
                bitDepth: 16,         // 16-bit samples
                sampleRate: 44100     // 44,100 Hz sample rate
            })
            let channal1 = fsM.createReadStream('/mic.raw')
            channal1.pipe(speaker55).on('finish', ()=>{
                console.log("pipe end")
            })

            //fsM.createReadStream('/mic.raw').pipe(v).pipe(speaker2)
        },10000
    )

*/


/*

            console.log('pass')
            micInputStream.on('stopComplete', function() {
                console.log("Got SIGNAL stopComplete");
                let audiobuffer = fsM.readFileSync('/output.wav')
                console.log('audi buffer size : ' + audiobuffer.length)
                if (audiobuffer.length === 0) {
                    console.log('no sound')
                    micInputStream.removeAllListeners()
                    return resolve()
                } else {
                    load(audiobuffer).then((buffer)=>{
                        play(buffer)
                        micInputStream.removeAllListeners()
                        return resolve()
                    })
                }
            });
            micInstance.start();
*/