



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
    ADD_object (persistedID,object) {
        persistedID = String(persistedID)
        if (this.objects.delete(persistedID) ) {
            console.log("replace object")
        } else {
            this.objects.set(persistedID, object)
        }
    }
    REMOVE_object (persistedID) {
        this.objects.delete(persistedID)
    }

    GET_object (persistedID) {
        return this.objects.get(persistedID)
    }
}

module.exports.HashMatrix = HashMatrix
module.exports.ObjectQuickInfo_Class = ObjectQuickInfo_Class