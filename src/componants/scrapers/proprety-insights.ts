import Hero, { ISuperElement } from "@ulixee/hero";
import Server from "@ulixee/server";
import fs from "fs";
import Locals from "../../misc/locals.js";

export default class PropretyInsights {
    private client: Hero | null
    private server: Server | null
    location: string
    private payload: { Proprety_Value_Estimated_Value: string | null }
    private waitFor: Boolean
    constructor() {
        this.client = null
        this.server = null
        this.location = Locals.Location
        this.payload = { Proprety_Value_Estimated_Value: null }
        this.waitFor = true
    }

    private async setup() {
        this.server = new Server();
        await this.server.listen({ port: 8021 });
        this.client = new Hero({
            connectionToCore: {
                host: `ws://localhost:${8021}`,
            },
        });

        (await this.client!.tabs).forEach((item) => {
            item.on('resource', async (recorce) => {
                if (recorce.url === "https://propertyinsights.nab.com.au/json.php") {
                    console.log(recorce.url)
                    console.log(await recorce.json)
                    let Data = await recorce.json
                    this.payload.Proprety_Value_Estimated_Value = Data.estimatedvalue
                    this.waitFor = false
                }
            })
        })

        this.client.on("close", () => {

        });
    }


    private async Bulk() {

        await this.client!.goto('https://propertyinsights.nab.com.au/')

        await this.client!.waitForLoad("AllContentLoaded")

        fs.writeFileSync('Before.jpeg', await this.client!.takeScreenshot())

        let SearchInput: ISuperElement = this.client!.document.querySelector('#data_propertyaddresssuburb')

        await this.client!.interact({ click: SearchInput })

        await this.client!.interact({ type: this.location })

        fs.writeFileSync('aftrerTyping.jpeg', await this.client!.takeScreenshot())

        //        await this.client!.interact({ keyPress: 18 })

        await this.client!.interact({ click: this.client!.document.querySelector('#bottomSearch') })

        while (this.waitFor) {
            await this.client!.waitForLoad('AllContentLoaded')
        }

    }


    public async exec() {
        await this.setup()
        if (this.client !== null) {

            await this.Bulk()

            return this.payload
        } else {
            console.log('Hero Failed To lunch')
        }
    }
}

//console.log(await new PropretyInsights("46 Clarey Crescent Spence ACT 2615").execute())