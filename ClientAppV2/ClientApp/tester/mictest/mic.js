const mic = require('mic')
const fs = require('fs')
const play = require('audio-play')
const load = require('audio-loader')
var createBuffer = require('audio-buffer-from')
const memoryFileSystem = require('memory-fs')

var micInstance = mic({
    rate: '16000',
    channels: '1',
    debug: false,
    fileType: 'wav'
});
let micInputStream = micInstance.getAudioStream()

let bufferQueue=[]

let soundtest = async () => {
    for (let i = 0; i < 5; i++) {
        console.log('i = ' + i)
        let spinwaitpass = false
        let fsM = new memoryFileSystem()

//var outputFileStream = fs.WriteStream('output.wav');


        micInputStream.pipe(fsM.createWriteStream('/output.wav'));


        micInputStream.on('data', function(data) {
            console.log("Recieved Input Stream: " + data.length);

        });

        micInputStream.on('error', function(err) {
            console.log("Error in Input Stream: " + err);
        });

        micInputStream.on('startComplete', function() {
            console.log("Got SIGNAL startComplete");
            setTimeout(function() {
                micInstance.stop();
            }, 5000);
        });

        await new Promise(resolve=>{
            console.log('pass')
            micInputStream.on('stopComplete', function() {
                console.log("Got SIGNAL stopComplete");
                let audiobuffer = fsM.readFileSync('/output.wav')
                console.log('audi buffer size : ' + audiobuffer.length)
                micInputStream.removeAllListeners()
                //micInputStream = null
                return resolve()
            });
            micInstance.start();
        })
        console.log('pass2')

    }

}

soundtest()


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