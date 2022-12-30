import Hero, { ISuperElement, ISuperNode } from "@ulixee/hero";
import Server from "@ulixee/server";

import fs from "fs"
import { AD } from "src/interfaces/scraper";


export default class Domain {
  private client: Hero | null;

  private server: Server | null;

  private source: string;

  private Payload: AD[];


  constructor() {
    this.client = null;

    this.server = null;

    this.Payload = [];

    this.source = "https://www.domain.com.au/sale/canberra-act/house/?bedrooms=4-any&bathrooms=2-any&carspaces=2-any";
  }

  private async setup() {
    this.server = new Server();

    await this.server.listen({ port: 8088 });

    this.client = new Hero({

      connectionToCore: {

        host: `ws://localhost:${8088}`,

      },

    });
  }

  //needs error handling 

  private async script() {
    //go to page

    await this.client!.goto(this.source, {
      timeoutMs
        : 0
    })
    let next = true
    while (next) {
      //scrape
      let Ads = await this.client!.document.querySelectorAll('#skip-link-content > div.css-1ned5tb > div.css-1mf5g4s > ul > li.css-1qp9106')
        .$map(async (item: ISuperNode): Promise<AD> => {
          let add = item.querySelector('h2');
          let urll = item.querySelector('a');
          let price_range = item.querySelector('p')
          //          let screenshot = item.querySelector('img');
          let screenshot = false
          return {
            address: (await add.innerText).split('\n').join(' '),
            url: await urll.href,
            price_range: price_range ? await price_range.innerText : null,
            screenshot: screenshot ? /* await screenshot.src */ "" : null
          }
        })
      console.log(Ads)
      // check if next page is true
      let nextPageBTN = await this.client!.document.querySelector('#skip-link-content > div.css-1ned5tb > div.css-sjrcov > div.css-1m7hti1 > div > a:nth-child(3)').$exists

      if (nextPageBTN) {
        let nextPageurl = await this.client!.document.querySelector('#skip-link-content > div.css-1ned5tb > div.css-sjrcov > div.css-1m7hti1 > div > a:nth-child(3)').href
        console.log(nextPageurl)
        await this.client!.goto(nextPageurl, { timeoutMs: 0 })
      } else {
        next = false
      }
    }

  }


  public async CloseUp(): Promise<void> {
    await this.client!.close();
    await this.server!.close();
  }

  public async exec(): Promise<AD[]> {
    await this.setup();
    if (this.client !== null) {
      await this.script();
      await this.CloseUp();
      return this.Payload;
    } else {
      console.log("Hero Failed To Load");
      return this.Payload
    }
  }
}

console.log(await new Domain().exec());
