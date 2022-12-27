import { Mail } from "src/interfaces/mail";
import MailGun from "mailgun.js"
import FormData from "form-data";
import Locals from "src/misc/locals";
export default class MailGunWrapper {

    private static templateBody = 'Address: <addr>\nPrice range: <pr>\nScreenshot: <screen>\nURL: <url>'
    
    public static async send(payload: Mail.payload){

        const body  = MailGunWrapper.templateBody
            .replace("<addr>", payload.address)
            .replace("<pr>", payload.price_range)
            .replace("<screen>", payload.screenshot!)
            .replace("<url>", payload.url)

        const API_KEY = Locals.MailGunApiKey;
        const DOMAIN = Locals.DomainName;

        const mailgun = new MailGun(FormData);
        const client = mailgun.client({username: 'api', key: API_KEY});

        const messageData = {
        from: Locals.EmailFrom,
        to: Locals.EmailTo,
        subject: Locals.EmailSubject,
        text: body
        };

        const status = await client.messages.create(DOMAIN, messageData)
            .then((res) => {
                console.log(res);
                return 0
            })
            .catch((err) => {
                console.error(err);
                return 1
            });

        return status;
    }
}