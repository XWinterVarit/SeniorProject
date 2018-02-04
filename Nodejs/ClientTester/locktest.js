const AsyncLock = require('async-lock')
const lock = new AsyncLock({maxPending: 1000})

let a = 5
/*
lock.acquire('key', (done) => {
    a += 6
    setTimeout(
        () => {

            done()
        },5000
    )
}, (err, ret) => {
    console.log("end lock 1")
    console.log("a = " + a)
})
lock.acquire('key', (done) => {
    a += 30
    done()
}, (err, ret) => {
    console.log("end lock 2")
    console.log("a = " + a)
})
*/
console.log("pass")
let tt = async () => {
    console.log("start with a : " + a)
    await lock.acquire('key', async()=>{
        a+=6
        console.log("calculation start")

        await new Promise(resolve => {
            setTimeout(
                () => {
                    return resolve()
                },5000
            )
        })
        console.log("calculation completed")
    }).catch((err)=>{
        console.log(err.message)
    })

    console.log("completed with a : " + a)

}
tt()