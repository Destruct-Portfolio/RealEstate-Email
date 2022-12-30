/** @format */
import dotenv from "dotenv";
dotenv.config({
	path: "../.env"
})
export default class Locals {
	static MailGunApiKey = process.env.MAIL_GUN_API_KEY!
	static DomainName = process.env.DOMAIN_NAME!
	static EmailSubject = process.env.EMAIL_SUBJECT!
	static EmailFrom = process.env.EMAIL_FROM!
	static EmailTo = process.env.EMAIL_TO!
	static SendCleanToken = process.env.SEND_CLEAN_TOKEN!
	static SendCleanOwnerId = process.env.SEND_CLEAN_OWNER_ID!
	static SmtpUserName = process.env.SMTP_USER_NAME!
	static PrLow = process.env.PR_LOW!
	static PrHigh = process.env.PR_HIGH!
}