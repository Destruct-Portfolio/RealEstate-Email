import Hero, { ISuperElement } from "@ulixee/hero";
import Server from "@ulixee/server";
import { AD } from "src/interfaces/scraper";


// the BREAK LOOP ISSUE THE Loop do not want to quite even tho there is an if statement is supposed to stop it 



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

  /**
   * @error is the LOOP IS BREAKING BECAUSE ITS FINDING THE ELEMENT BUT NOT THE A 
   */

  private async Bulk(): Promise<void> {
    await this.client!.goto(this.source, { timeoutMs: 0 });

    await this.client!.waitForLoad("AllContentLoaded");

    let next_page = true;
    let NextPageUrl: string = ""
    while (next_page) {

      console.log(`[>>] ${await this.client!.url} `)

      try {
        let ADS = await this.client!.document.querySelectorAll(
          "#skip-link-content > div.css-1ned5tb > div.css-1mf5g4s > ul > li.css-1qp9106"
        ).$map(async (item) => {
          let Price: string | null | ISuperElement;
          let Link = item.querySelector("a");
          Price = item.querySelector("p");
          let Address = item.querySelector("h2");

          if ((await Price.innerText).includes('Auction')) {
            Price = null
          } else if (/\d/.test(await Price.innerText)) {
            Price = await Price.innerText
          } else {
            Price = null
          }


          console.log({
            Link: await item.querySelector('a').href,
            Price: Price,
            Location: (await item.querySelector('h2').innerText).split('\n').join('')
          })

          this.Payload.push({
            Link: await item.querySelector('a').href,
            Price: "(await Price)",
            Location: (await item.querySelector('h2').innerText).split('\n').join('')
          })

        });

      } catch (error) {
        console.log('Fuck you cutn')
      }

      try {
        let t = this.client!.document.querySelector('#skip-link-content > div.css-1ned5tb > div.css-sjrcov > div.css-1m7hti1 > div > a:nth-child(3)')

        NextPageUrl = await t.href

      } catch (error) {

        next_page = false
      }

      if (NextPageUrl) {
        console.log('INSIDE THE NOT NULL')
        NextPageUrl = await this.client!.document.querySelector(
          "#skip-link-content > div.css-1ned5tb > div.css-sjrcov > div.css-1m7hti1 > div > a:nth-child(3)"
        ).href;

        console.log(`[<<] Next Page URL ::  ` + NextPageUrl);

        await this.client!.goto(NextPageUrl, { timeoutMs: 0 });

        await this.client!.waitForLoad("AllContentLoaded");

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
      await this.Bulk();
      await this.CloseUp();
      return this.Payload;
    } else {
      console.log("Hero Failed To Load");
      return this.Payload
    }
  }
}

//console.log(await new Domain().exec());
