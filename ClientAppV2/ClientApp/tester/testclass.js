



class A {
    constructor() {
        this.B = B
    }
}
class B {
    constructor() {

    }
}
class C {
    constructor() {

    }
    static printSomething() {
        console.log("weoll")
    }
}
A.B.C.printSomething()