import Locals from "src/misc/locals.js"
import AllHomes from "../componants/scrapers/all-homes.js"
import Domain from "../componants/scrapers/domain.js"
import PropertyValue from "../componants/scrapers/property-value.js"
import PropretyInsights from "../componants/scrapers/proprety-insights.js"
import RealEstate from "../componants/scrapers/realestate.js"
import Zango from "../componants/scrapers/zango.js"

// should change this
import { AD } from "../interfaces/scraper"
import MailGunWrapper from "src/componants/mailers/mailgun.js"
import SendCleanWrapper from "src/componants/mailers/sendclean.js"


export default class Handler {

    private static sites = [
        AllHomes,
        Zango,
        Domain,
        PropertyValue,
        PropretyInsights,
        RealEstate
    ]

    public static async exec() {
        
        let allResults: AD[] = []
        
        for(const site of Handler.sites){
            //@ts-ignore
            allResults.push(...await new site().exec())
        }

        allResults = allResults
            .filter(result=>{
                return eval(`${result.Price!} >= ${Locals.PrLow} && ${result.Price!} <= ${Locals.PrHigh}`)
            })

        for(const result of allResults){
            //@ts-ignore
            const status = await MailGunWrapper.send(result) // adjust the payload
            
            // fallback method

            //@ts-ignore
            if(status!==0) await SendCleanWrapper.send(result)
        }

    }
}