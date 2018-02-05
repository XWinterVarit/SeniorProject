



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

module.exports.HashMatrix = HashMatrix