

const chalk = require('chalk')


module.exports.randomInteger = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
module.exports.RequestFilter = (request, options) => {
    /*
      for (let properties in request) {
              if (request.hasOwnProperty(properties)) {
                      console.log(properties);
              }
      }
      */

    if (options.bool_permitprob === true) {
        let permitSet = options.setarr_permitprob;
        let probcount = 0
        for (let properties in request) {
            if (Object.hasOwnProperty.call(request,properties)) {
                if (!permitSet.has(properties)) {
                    delete request[properties]
                } else {
                    probcount++
                }
            }
        }
        console.log("probcount is : " + probcount)
        console.log("permitSet is : " + permitSet.size)
        console.log("show after remove")
        console.log(request)

        if (probcount < permitSet.size) {
            return {validation_numprob: false, validation_message: 'element not enough'}
        } else {
            return {validation_numprob: true}
        }


    }

}

class HashMatrix {
    constructor() {
        this.matrix = new Map()
        this.sizeX = 0
        this.sizeY = 0
    }
    set(posX, posY, something) {
        if (posX > this.sizeX - 1) {
            this.sizeX = posX + 1
        }
        if (posY > this.sizeY - 1) {
            this.sizeY = posY + 1
        }
        this.matrix.set(posX + "," + posY, something)
    }
    get(posX, posY) {
        return this.matrix.get(posX+","+posY)
    }

    getInfo() {
        console.log("matrix size X : " + this.sizeX + " Y : " + this.sizeY)
    }
    getSizeX(){
        return this.sizeX
    }
    getSizeY() {
        return this.sizeY
    }

}

class ObjectQuickInfo_Class {
    constructor () {
        this.objects = new Map()

    }
    ADD_object (linkpersistedID,object) {
        linkpersistedID = String(linkpersistedID)
        if (this.objects.has(linkpersistedID) ) {
            console.log("replace object")
        } else {
            console.log(chalk.yellow("Show link persistedID" + linkpersistedID))
            console.log(chalk.yellow("Show object"))
            console.log(JSON.stringify(object, null, 4))
            this.objects.set(linkpersistedID, object)
        }
    }
    REMOVE_object (linkpersistedID) {
        this.objects.delete(linkpersistedID)
    }

    GET_object (linkpersistedID) {
        return this.objects.get(linkpersistedID)
    }

    MONITOR () {
        let messages = ""
        /*
        for (let i in this.objects) {
            messages += i
        }
        */
        //console.log(chalk.yellow(JSON.stringify(this.objects, null, 4)))
        //console.log(chalk.yellow(this.apps))

        for (let i of this.objects) {
            messages += JSON.stringify(i) + " \n"
        }
        return messages
    }
}

class BufferUtility {



    static array_prepared (arrays_of_buffer) {
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
            if (i.length < 100) {
                newArray.push(new Buffer(i, 'utf-8'))
                console.log("notBuffer")
            } else {
                //newArray.push(new Buffer(i))
                console.log("isBuffer")
                newArray.push(i)
            }
        }
        return newArray
    }
    static combinebuffer (prepared_array) {
        return Buffer.concat(prepared_array)
    }

    static extractbuffer (combinebuffer) {
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
    static createBuffer (anyarray) {
        return this.combinebuffer(this.array_prepared(anyarray))
    }
    static printArrayofBuffer (arrays) {
        arrays.map((i)=>{
            if (i.length >= 30) {
                console.log("LARGE")
            } else {
                console.log(i.toString())
            }
        })
    }

    static bufferCutter (largebuffer, cutlength) {
        let largebuffer_length = largebuffer.length
        console.log("Buffer length : " + largebuffer_length)
        let arrayofcuttedbuffer = []
        let maximumcutloop = 10000000
        let offset = 0
        let endoffset = 0
        for (let i = 0; i < maximumcutloop; i++) {
            if (largebuffer_length <= 0) {
                break
            }
            if (largebuffer_length < cutlength) {
                endoffset = offset + largebuffer_length
                largebuffer_length = 0
            } else {
                endoffset = offset + Number(cutlength)
                largebuffer_length -= cutlength
            }
            let slicedbuffer = largebuffer.slice(offset, endoffset)
            arrayofcuttedbuffer.push(slicedbuffer)
            //console.log(slicedbuffer.toString())

            console.log("isBuffer " + Buffer.isBuffer(slicedbuffer))
            //console.log(`Cutting at offset : ${offset} to : ${endoffset} left : ${largebuffer_length}`)
            offset = endoffset
        }
        return arrayofcuttedbuffer
    }


}



module.exports.HashMatrix = HashMatrix
module.exports.ObjectQuickInfo_Class = ObjectQuickInfo_Class
module.exports.BufferUtility = BufferUtility