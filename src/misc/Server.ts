// create an abstract class that will create a server and client and will extend to others

abstract class CLient {
    protected port: string

    constructor(port: string) {
        this.port = port
    }

    createServerAndShit() {
        return true
    }


}