/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
//////////////////////////Requirement Section////////////////////////
/////////////////////////////////////////////////////////////////////
///////**//This code require javascript version 6 or newer//**///////
////////////////////////miscellaneous////////////////////////////////

const chalk = require('chalk')
const ndarray = require('ndarray')
const MatrixHash = require('matrix-hash')
const AsyncLock = require('async-lock')
////////////////////////////From Configs/////////////////////////////

///////////////////////From Other Controllers////////////////////////

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////


//==================================================================================================
//==================================================================================================
//==================================================================================================




class Group_Queue_Class {
    constructor () {
        this.queue = []
        this.worksSize = 0
        this.CLASS_queueType = class {
            constructor(func, args) {
                this.func = func
                this.args = args
            }
        }
        this.LOCK_queue = new AsyncLock()

    }

    ADD_queue (func, args) {
        //console.log("show func add " + func)

        this.LOCK_queue.acquire('key', (done) => {
            console.log("**************start lock region***************** of args : " + args)
            this.queue.push(new this.CLASS_queueType(func, args))
            if (this.worksSize === 0) {
                console.log("show before worksize : " + this.worksSize)
                this.worksSize++
                console.log("show after worksize : " + this.worksSize)

                console.log("auto start")
                done()
                Group_Queue_Class.DO_queue(this)
            } else {
                console.log("show worksSize: " + this.worksSize)
                this.worksSize++
                done()
            }
        }, (err, ret) => {
            if (err)
                console.log("Lock error : " + err)
            else {
                console.log("end Lock")
                console.log("show after worksize : " + this.worksSize)

            }
        })



        //console.log("show array " + JSON.stringify(this.queue, null, 4))
    }

    async REDUCE_worksize () {
        await this.LOCK_queue.acquire('key', () => {
            console.log("******* start reduce lock region******* of args : ")
            this.worksSize--
        }).catch((err)=>{
            console.log("Lock error : " + err)
        })
        console.log("end lock")
        console.log("show workSize after reduce : " + this.worksSize)

        /*
        this.LOCK_queue.acquire('key', (done) => {
            console.log("******* start reduce lock region******* of args : ")
            this.worksSize--
            done()
        }, (err, ret) => {
            if (err)
                console.log("Lock error : " + err)
            else {
                console.log("end reduce Lock")
                console.log("show workSize after reduce : " + this.worksSize)
            }
        })
        */
    }
    static DO_queue (queueRef) {
        //let onequeue = queueRef.queue.shift()
        //queueRef.worksSize--
        let onequeue

            onequeue = queueRef.queue.shift()

                if (onequeue) {
                    let func = onequeue.func
                    let args = onequeue.args
                    console.log("one queue start")
                    func.DOTASK(args,queueRef)
                } else {
                    console.log("queue empty")
                }


        //console.log("show func" + JSON.stringify(onequeue, null, 4))


    }
}

class WorkSomething {
    constructor (text) {
        this.text = text
    }
    ADD_text (specialtext) {
        this.text += "A" + specialtext
    }
    async DOTASK (args,queueRef) {
        this.ADD_text(args.specialtext)
        await new Promise(resolve => {
            setTimeout(
                () => {
                    return resolve()
                }
            ,2000)
        })
        console.log("OK")


        await queueRef.REDUCE_worksize()
        Group_Queue_Class.DO_queue(queueRef)
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


module.exports.Group_Queue_Class = Group_Queue_Class
module.exports.WorkSomething = WorkSomething
module.exports.HashMatrix = HashMatrix