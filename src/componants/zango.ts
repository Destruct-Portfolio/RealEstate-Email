import Hero, { ISuperElement } from "@ulixee/hero";
import Server from "@ulixee/server";
import fs from "node:fs";
import { AD } from "src/types";

// need to fix the Fucking LOOP TO SCRAPE THE THINGS



class allhomes {
    private client: Hero | null;
    private server: Server | null;
    private source: string;
    private Payload: AD[]

    constructor() {
        this.client = null;
        this.server = null;
        this.Payload = [];
        this.source =
            "https://zango.com.au/sale/search/?listing_type=buy&surrounding=true&bedrooms__gte=4&bathrooms__gte=2&parking__gte=2&categories=House&order_by=price&property_status_groups=current,underOffer,includePrivate&region_group=ACT%20%26%20Surrounds&filters=1&page=1";
    }

    private async setup() {
        this.server = new Server();
        await this.server.listen({ port: 8081 });
        this.client = new Hero({
            connectionToCore: {
                host: `ws://localhost:${8081}`,
            },
        });

        this.client.on("close", () => {
            //this._logger.info("shutting down server and client");
        });
    }
    /* 
        private async Bulk() {
            await this.client!.goto(this.source);
            await this.client!.waitForLoad("AllContentLoaded");
            fs.writeFileSync("Pic.jpeg", await this.client!.takeScreenshot());
    
            let NextPage = true;
            while (NextPage) {
    
                // Looking for the Next BTN 
                let NextPage_Button = this.client!.document.querySelector('#__next > div.styleglobal__PageWrap-c1gt2v-22.fjDMGE > div > section:nth-child(6) > div > section:nth-child(2) > div > div.Paginationstyled__PaginationWrap-l7vzz9-0.dKJzPW > ul > li.next')
    
                // if We find the Next BTN 
                if (NextPage_Button !== null) {
    
                    try {
    
                        console.log(`[+] ${await this.client!.url} Loaded ...`)
    
                        let Articles = await this.client!.document.querySelectorAll(
                            "#__next > div.styleglobal__PageWrap-c1gt2v-22.fjDMGE > div > section:nth-child(6) > div > section:nth-child(1) > div > div > div > article"
                        ).$map(async (item) => {
    
                            let Price: string | null | ISuperElement
    
                            let link = await item.querySelector('div > a').href
                            let add = await item.querySelector('div > h3').innerText
                            Price = await item.querySelector('h4').innerText
    
                            // To check if the Price has Auction in the Sentence 
                            if (Price.includes("Auction")) {
                                Price = null
                            }
    
                            // to Also check if the Price Has Numbers in it 
                            else if (/\d/.test(Price)) {
                                Price = Price
                            }
    
                            // in auther casses we will return null
                            else {
                                Price = null
                            }
    
                            console.log({
                                link, add, Price
                            })
    
                        });
    
                        // Navigating to the Next Page 
                        await this.client!.goto(await NextPage_Button.querySelector('a').href, { timeoutMs: 0 })
                        await this.client!.waitForLoad('AllContentLoaded')
    
                    } catch (error) {
    
                        console.log(`[-] Page ${await this.client!.url} Didn't Load Properly`)
                    }
    
                } else {
    
                    NextPage = false
    
                }
            }
        }
     */

    private async Scrap() {

        try {
            console.log(`[+] ${await this.client!.url} Loaded ...`)

            let Articles = await this.client!.document.querySelectorAll(
                "#__next > div.styleglobal__PageWrap-c1gt2v-22.fjDMGE > div > section:nth-child(6) > div > section:nth-child(1) > div > div > div > article"
            ).$map(async (item) => {

                let Price: string | null | ISuperElement

                let link = await item.querySelector('div > a').href
                let add = await item.querySelector('div > h3').innerText
                Price = await item.querySelector('h4').innerText

                // To check if the Price has Auction in the Sentence 
                if (Price.includes("Auction")) {
                    Price = null
                }

                // to Also check if the Price Has Numbers in it 
                else if (/\d/.test(Price)) {
                    Price = Price
                }

                // in auther casses we will return null
                else {
                    Price = null
                }
                console.log({
                    link, add, Price
                })

            });

        } catch (error) {

            console.log(`[-] Page ${await this.client!.url} Didn't Load Properly`)
        }

    }

    private async Bulk() {
        await this.client!.goto(this.source, { timeoutMs: 0 })
        //await this.client!.waitForLoad('AllContentLoaded')

        fs.writeFileSync('First.jpeg', await this.client!.takeScreenshot())

        let GetLastPage: ISuperElement = this.client!.document.querySelector('#__next > div.styleglobal__PageWrap-c1gt2v-22.fjDMGE > div > section:nth-child(6) > div > section:nth-child(2) > div > div.Paginationstyled__PaginationWrap-l7vzz9-0.dKJzPW > ul > li.last > a')

        await this.client!.interact({ click: GetLastPage })

        fs.writeFileSync('lastPage.jpeg', await this.client!.takeScreenshot())

        await this.client!.waitForLoad("HttpRedirected")

        //await this.client!.goto(GetLastPage, { timeoutMs: 0 })

        let LastPage = await this.client!.document.querySelector('#__next > div.styleglobal__PageWrap-c1gt2v-22.fjDMGE > div > section:nth-child(6) > div > section:nth-child(2) > div > div.Paginationstyled__PaginationWrap-l7vzz9-0.eGPbLX > ul > li.active > a').innerText

        console.log(LastPage)

    }

    public async exec() {
        await this.setup();
        if (this.setup !== null) {

            console.log("Starting the Job ");

            await this.Bulk();

            return;
        } else {
            console.log("Server has Failed to load");

            return;
        }
    }
}

console.log(await new allhomes().exec());
