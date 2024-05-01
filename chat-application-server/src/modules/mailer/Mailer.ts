import CONFIG from '../../config/config.json'
import Mail, { MailService } from '@sendgrid/mail'
import SMS, { Twilio } from 'twilio'
import { MessageListInstanceCreateOptions } from 'twilio/lib/rest/api/v2010/account/message'

/**
 * @class Crypto
 * @author Gilles Cédric
 * @description this class is used for the the encryption and decryption in the application
 * @exports
 * @default
 * @since 23/05/2022
 */
export default class Mailer {

	private static readonly sgMail: MailService = Mail

	private static sms: Twilio

	/**
	 * @function encrypt
	 * @static
	 * @description this __OBJECT__ is used to create a **AES** string from the given message
	 * @param {string} message s.e.
	 * @returns {string} the encoded AES hash
	 */
	public static readonly config = (): void => {
		this.sgMail.setApiKey(process.env.TWILLIO_EMAIL_API_KEY)
		this.sms = SMS(process.env.TWILLIO_SMS_ACCOUNT_SID, process.env.TWILLIO_SMS_AUTH_TOKEN)
	}

	public static readonly sendMail = async (data: Mail.MailDataRequired) => await this.sgMail.send(data)

	public static readonly sendSMS = async (data: MessageListInstanceCreateOptions) => await this.sms.messages.create(data)


}
