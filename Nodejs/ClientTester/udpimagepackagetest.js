var PORT = 44444;
var HOST = '127.0.0.1';
const fs = require('fs')
var dgram = require('dgram');
var message = new Buffer('My KungFu is Good!');
let frame_message = fs.readFileSync('./cat_thumb.jpg')


let first = "apple"
let second = "iphone"
let end = "end"
//console.log(first.length)
/*
first = new Buffer(first, 'utf-8')
second = new Buffer(second, 'utf-8')
end = new Buffer(end, 'utf-8')

let a = [first, second, end]
let buf = Buffer.concat(a)
let bufs1 = buf.slice(0,5)
let bufs2 = buf.slice(5,11)

console.log(bufs1.toString())
console.log(bufs2.toString())
*/
let array_prepared = (arrays_of_buffer) => {
    let newArray = []
    newArray.push(new Buffer(String(arrays_of_buffer.length),'utf-8'))
    for (let i of arrays_of_buffer) {
        let slength = String(i.length)
        if (slength.length > 9) {
            console.log("too much length")
            return null
        }
        let slengthoflength = String(slength.length)

        newArray.push(new Buffer(slengthoflength, 'utf-8'))
        newArray.push(new Buffer(slength, 'utf-8'))
        newArray.push(new Buffer(i, 'utf-8'))
    }
    return newArray
}
let combinebuffer = (prepared_array) => {
    return Buffer.concat(prepared_array)
}
let extractbuffer = (combinebuffer) => {
    let outputArray = []
    try {
        let elementlength = combinebuffer.slice(0,1)
        console.log("show element length " + elementlength)
        console.log("show buffer length " + combinebuffer.length)
        let offset = 1
        for (let i = 0; i < elementlength; i++) {
            let slengthoflength = Number(combinebuffer.slice(offset,offset+1))
            offset++
            let slength = Number(combinebuffer.slice(offset, offset+slengthoflength))
            offset+=slengthoflength
            console.log("at element : " + (i+1) + " this has length : " + slength + " from offset : " + offset  + "  to " + (offset+slength))

            outputArray.push(combinebuffer.slice(offset, offset+slength))
            offset+=slength
        }
    } catch (error) {
        console.log("extract error cause by : " + error)
    }
    return outputArray
}

let printArrayofBuffer = (arrays) => {
    arrays.map((i)=>{
        if (i.length >= 30) {
            console.log("LARGE")
        } else {
            console.log(i.toString())
        }
    })
}
//printArrayofBuffer(array_prepared([first, second, end]))
let pp = array_prepared([first, frame_message, second, end])
printArrayofBuffer(pp)

let a = combinebuffer(pp)
let b = extractbuffer(a)
printArrayofBuffer(b)
