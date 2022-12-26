import Hero, { ISuperElement } from "@ulixee/hero";
import Server from "@ulixee/server";
import fs from "fs";

/**
 * website Refusing to lunch need to ask Robbert on whats up or Try on an other Machine 
 */

class RealEstate {
  private client: Hero | null;

  private server: Server | null;

  private source: string;

  private Payload: any[];

  constructor() {
    this.client = null;

    this.server = null;
    this.Payload = [];

    this.source =
      "https://www.realestate.com.au/buy/property-house-with-4-bedrooms-in-australian+capital+territory/list-1?numParkingSpaces=2&numBaths=2&includeSurrounding=false";
  }

  private async setup() {
    this.server = new Server();
    await this.server.listen({ port: 8088 });
    this.client = new Hero({
      connectionToCore: {
        host: `ws://localhost:${8088}`,
      },
    });

    this.client.on("close", () => {
      //this._logger.info("shutting down server and client");
    });
  }

  private async Bulk() {
    await this.client!.goto(this.source, { timeoutMs: 0 });
    await this.client!.waitForLoad("AllContentLoaded");
    fs.writeFileSync("j.jpeg", await this.client!.takeScreenshot());
    let NumPages = this.client!.document.querySelector(
      "#argonaut-wrapper > div.results-page > div.layout.layout--no-mobile-gutters.results-page__content > div > div.divided-content > div.tiered-results-container > div > div:nth-child(32) > div > nav > div.styles__PaginationNumbers-sc-54p2uy-5.cqCCeR > a:nth-child(6)"
    );
    console.log(await NumPages.innerText);

    /*     let numPages = parseInt(
      await this.client!.document.querySelector(
        "#argonaut-wrapper > div.results-page > div.layout.layout--no-mobile-gutters.results-page__content > div > div.divided-content > div.tiered-results-container > div > div:nth-child(32) > div > nav > div.styles__PaginationNumbers-sc-54p2uy-5.cqCCeR > a:nth-child(6)"
      ).innerHTML
    ); */

    /*    console.log(numPages); */

    /*  for (let index = 1; index < numPages; index++) {
      await this.client!.goto(
        `https://www.realestate.com.au/buy/property-house-with-4-bedrooms-in-australian+capital+territory/list-${index}?numParkingSpaces=2&numBaths=2&includeSurrounding=false`,
        { timeoutMs: 0 }
      );
      await this.client!.waitForLoad("AllContentLoaded");

      let Ads = await this.client!.document.querySelectorAll(
        "#argonaut-wrapper > div.results-page > div.layout.layout--no-mobile-gutters.results-page__content > div > div.divided-content > div.tiered-results-container > div > div > article.Card__Box-sc-g1378g-0"
      ).$map(async (item) => {
        let Link = item.querySelector("a");
        let address = item.querySelector("h2");
        let Price = item.querySelector("span.property-price");
        return {
          Link: Link ? await Link.innerText : null,
          address: address ? await address.innerText : null,
          Price: Price ? Price.innerText : null,
        };
      });
      console.log(Ads);
    } */
  }

  public async CloseUp() {
    await this.client!.close();
    await this.server!.close();
  }
  public async exec() {
    await this.setup();
    if (this.client !== null) {
      console.log("Start");
      await this.Bulk();
      await this.CloseUp();
      return this.Payload;
    } else {
      console.log("Hero Failed To Load");
    }
  }
}

console.log(await new RealEstate().exec());
