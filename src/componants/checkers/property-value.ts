import Hero, { ISuperElement } from "@ulixee/hero";
import Server from "@ulixee/server";
import fs from "fs";

export default class PropertyValue {
    private client: Hero | null
    private server: Server | null
    location: string
    private payload:  string | null 
    constructor(location: string) {
        this.client = null
        this.server = null
        this.location = location
        this.payload = null
    }

    private async setup() {
        this.server = new Server();
        await this.server.listen({ port: 8092 });
        this.client = new Hero({
            connectionToCore: {
                host: `ws://localhost:${8092}`,
            },
        });

        this.client.on("close", () => {
            //this._logger.info("shutting down server and client");
        });
    }


    private async Bulk() {
        await this.client!.goto('https://www.propertyvalue.com.au/')
        await this.client!.waitForLoad("AllContentLoaded")

        fs.writeFileSync('Before.jpeg', await this.client!.takeScreenshot())
        let CookieBTN: ISuperElement = this.client!.document.querySelector('#acceptCookieButton')
        await this.client!.waitForElement(CookieBTN)
        await this.client!.interact({ click: CookieBTN })
        let InputBox = this.client!.document.querySelector('#propertysearch')
        fs.writeFileSync('After.jpeg', await this.client!.takeScreenshot())
        await this.client!.interact({ click: InputBox })
        await this.client!.interact({ type: this.location })
        fs.writeFileSync('AFTERTYPING.jpeg', await this.client!.takeScreenshot())
        await this.client!.interact({ keyPress: 18 })
        await this.client!.waitForLoad('NavigationRequested')
        fs.writeFileSync('afterClick.jpeg', await this.client!.takeScreenshot())
        let t: ISuperElement = await this.client!.document.querySelector('#propEstimatedPrice')
        let element = await this.client!.waitForElement(t)
        console.log(element ? await t.innerText : null)
        this.payload = element ? await t.innerText : null
    }


    public async exec() {
        await this.setup()
        if (this.client !== null) {
            console.log('Fucking Cunt ')
            await this.Bulk()
            return this.payload
        } 
        
        return this.payload
    }
}

//console.log(await new propertyValue("46 Clarey Crescent Spence ACT 2615").execute())