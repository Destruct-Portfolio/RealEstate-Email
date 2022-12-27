import { Mail } from "src/interfaces/mail";
import * as SendClean from "sendclean";
import { SendMailParameters } from "sendclean/lib/utils/interfaces";
import Locals from "src/misc/locals";

export default class SendCleanWrapper {
    private static templateBody = 'Address: <addr>\nPrice range: <pr>\nScreenshot: <screen>\nURL: <url>'
    
    public static async send(payload: Mail.payload){

        const body  = SendCleanWrapper.templateBody
            .replace("<addr>", payload.address)
            .replace("<pr>", payload.price_range)
            .replace("<screen>", payload.screenshot!)
            .replace("<url>", payload.url)

        let SendClean_client = new SendClean.SendClean({
            owner_id: Locals.SendCleanOwnerId,
            token: Locals.SendCleanToken
        });
        
        let param: SendMailParameters = {
            smtp_user_name: Locals.SmtpUserName,
            message: {
                subject: Locals.EmailSubject,
                from_email: Locals.EmailFrom,
                to: [
                    {
                        email: Locals.EmailTo
                    }
                ],
                text: body
            }
        }
        
        SendClean_client.composeMail(param)
    }
}