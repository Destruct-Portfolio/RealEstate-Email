import Hero from "@ulixee/hero";
import Server from "@ulixee/server";
import { AD } from "src/interfaces/scraper";

export default class AllHomes {
  private client: Hero | null;
  private server: Server | null;
  private source: string;
  private Payload: AD[]

  constructor() {
    this.client = null;

    this.server = null;


    this.source =
      "https://www.allhomes.com.au/sale/search?region=canberra-act&propertytypes=house&beds=4-&baths=2-&parking=2-";

    this.Payload = []
  }

  private async setup() {
    this.server = new Server();
    await this.server.listen({ port: 8080 });
    this.client = new Hero({
      connectionToCore: {
        host: `ws://localhost:${8080}`,
      },
    });

    this.client.on("close", () => {

    });
  }

  private async Bulk() {
    await this.client!.goto(this.source);

    await this.client!.waitForLoad("AllContentLoaded");

    let numPages = parseInt(
      await this.client!.document.querySelector(
        "section > div.css-1lt92s1 > div.css-1rk3iho > div.css-1t2vh5b > div > a:nth-child(7)"
      ).innerText
    );

    for (let index = 0; index < numPages; index++) {
      try {
        await this.client!.goto(
          `https://www.allhomes.com.au/sale/search?page=${index}&region=canberra-act&propertytypes=house&beds=4-&baths=2-&parking=2-`
        );

        await this.client!.waitForLoad("AllContentLoaded");

        console.log(`[>>] ${await this.client!.url}`)

        let ADS = await this.client!.document.querySelectorAll(
          "div.css-1r6lu77"
        ).$map(async (item: { querySelector: (arg0: string) => any; }) => {
          let Link = item.querySelector("a");
          let Add = item.querySelector("h2");
          let Price = item.querySelector("div.css-tjtee4");

          this.Payload.push({
            url: await Link.href,
            address: (await Add.innerText).split("\n").join(" "),
            price_range: (await Price.innerText).includes("Auction") ? null : await Price.innerText,
            // to add 
            screenshot: ''
          })

        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  public async CloseUp(): Promise<void> {
    await this.client!.close();
    await this.server!.close();
  }


  public async exec(): Promise<AD[]> {
    await this.setup();
    if (this.setup !== null) {
      await this.Bulk();
      await this.CloseUp()
      return this.Payload;
    } else {
      console.log("Server has Failed to load");
      return this.Payload;
    }
  }
}

//console.log(await new allhomes().exec());
