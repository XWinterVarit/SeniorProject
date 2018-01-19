const AsyncLock = require('async-lock')
const lock = new AsyncLock({maxPending: 1000})

let a = 5

lock.acquire('key', (done) => {
    setTimeout(
        () => {
            a = 6
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
console.log("pass")
