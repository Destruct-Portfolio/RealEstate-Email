import Locals from "src/misc/locals.js"
import AllHomes from "../componants/scrapers/all-homes.js"
import Domain from "../componants/scrapers/domain.js"
import PropertyValue from "../componants/checkers/property-value.js"
import PropretyInsights from "../componants/checkers/proprety-insights.js"
import RealEstate from "../componants/scrapers/realestate.js"
import Zango from "../componants/scrapers/zango.js"

// should change this
import { AD } from "../interfaces/scraper"
import MailGunWrapper from "src/componants/mailers/mailgun.js"
import SendCleanWrapper from "src/componants/mailers/sendclean.js"
import { Mail } from "src/interfaces/mail.js"


export default class Handler {

    private static sites = [
        AllHomes,
        Zango,
        Domain,
        RealEstate
    ]
    
    private static checkers = [
        PropertyValue,
        PropretyInsights
    ]

    public static async exec() {
        
        let allResults: AD[] = []
        
        for(const site of Handler.sites){
            allResults.push(...await new site().exec())
        }
        
        for(const [index, result] of allResults.entries()){
            if(!result.price_range){
                const priceEstimations = []
                for( const checker of Handler.checkers){
                    const estimate = await new checker(result.address).exec()
                    if(estimate) priceEstimations.push(estimate)
                }

                switch(priceEstimations.length) {
                    case 0:
                        break;
                    case 1:
                        allResults[index].price_range = priceEstimations.filter(price=>price)[0]
                    case 2:
                        allResults[index].price_range = eval(`(${priceEstimations[0]}+${priceEstimations[1]})/2`).toString()
                }
            }
        }

        allResults = allResults
            .filter(result=>result.price_range) 
            .filter(result=>{
                // add logic for handling mutliple price formats
                return eval(`${result.price_range!} >= ${Locals.PrLow} && ${result.price_range!} <= ${Locals.PrHigh}`)

            }) as Mail.payload[]

        for(const result of allResults as Mail.payload[]){
            const status = await MailGunWrapper.send(result) 
            
            // fallback method
            if(status!==0) await SendCleanWrapper.send(result)
        }

    }
}