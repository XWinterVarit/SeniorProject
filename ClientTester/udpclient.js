const fs = require('fs')
const screenshot = require('desktop-screenshot')
const screenshot2 = require('screenshot-desktop')
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
    setInterval(
        () => {
            framepass++;
            if (working === true) {
                framedrop++;
            } else {
                working = true
                console.log("start take screenshot")


                screenshot2().then((img)=>{
                    fs.writeFileSync('well' + framepass + '.bmp', img, (err) => {
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