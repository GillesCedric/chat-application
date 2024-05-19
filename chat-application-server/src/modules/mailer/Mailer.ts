/**
 * Cette classe est utilisée pour gérer l'envoi d'emails et de SMS dans l'application.

 * 
 * @module modules/mailer/Mailer
 * 
 */
import CONFIG from '../../config/config.json';
import Mail, { MailService } from '@sendgrid/mail';
import SMS, { Twilio } from 'twilio';
import { MessageListInstanceCreateOptions } from 'twilio/lib/rest/api/v2010/account/message';

/**
 * @class Mailer
 * @description Cette classe est utilisée pour gérer l'envoi d'emails et de SMS dans l'application.
 * @exports Mailer
 * @since 23/05/2022
 */
export default class Mailer {

	/**
	 * Instance du service SendGrid Mail.
	 * @private
	 * @static
	 */
	private static readonly sgMail: MailService = Mail;

	/**
	 * Instance du service Twilio SMS.
	 * @private
	 * @static
	 */
	private static sms: Twilio;

	/**
	 * Configure les services d'envoi d'emails et de SMS avec les clés API.
	 * @function config
	 * @static
	 * @returns {void}
	 */
	public static readonly config = (): void => {
		this.sgMail.setApiKey(process.env.TWILLIO_EMAIL_API_KEY);
		this.sms = SMS(process.env.TWILLIO_SMS_ACCOUNT_SID, process.env.TWILLIO_SMS_AUTH_TOKEN);
	}

	/**
	 * Envoie un email en utilisant le service SendGrid.
	 * @function sendMail
	 * @static
	 * @param {Mail.MailDataRequired} data - Les données nécessaires pour envoyer l'email.
	 * @returns {Promise<[any, any]>} Une promesse résolue lorsque l'email est envoyé.
	 */
	public static readonly sendMail = async (data: Mail.MailDataRequired): Promise<[any, any]> => {
		return await this.sgMail.send(data);
	}

	/**
	 * Envoie un SMS en utilisant le service Twilio.
	 * @function sendSMS
	 * @static
	 * @param {MessageListInstanceCreateOptions} data - Les données nécessaires pour envoyer le SMS.
	 * @returns {Promise<any>} Une promesse résolue lorsque le SMS est envoyé.
	 */
	public static readonly sendSMS = async (data: MessageListInstanceCreateOptions): Promise<any> => {
		return await this.sms.messages.create(data);
	}

}
