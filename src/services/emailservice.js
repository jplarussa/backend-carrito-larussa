import nodemailer from 'nodemailer';
import config from '../config/config.js';


export default class EmailService {

    static #transporter
    constructor() {
        if (!EmailService.#transporter) {

            EmailService.#transporter = nodemailer.createTransport({
                service: 'gmail',
                port: 587,
                auth: {
                    user: config.gmailAccount,
                    pass: config.gmailAppPassword
                }
            });

            EmailService.#transporter.verify(function (error, success) {

                if (error) {
                    console.warn(`Transporter verify error:  ${error} `);
                } else {
                    console.info(`Server is ready to take our messages.`);
                }
            });
        }
    };

    #mailOptions = (receiver, title, message) => {
        return {
            from: "JP Store" + config.gmailAccount,
            to: receiver,
            subject: title ? title : "Email test from JP Store",
            html: `<div><h1>${message ? message : "This is a test of sending emails with Nodemailer!"}</h1></div>`,
            attachments: []
        }
    }

    async sendEmail(email, message, title, callback) {

        let finalEmail = email ? email : config.gmailAccount;

        EmailService.#transporter.sendMail(this.#mailOptions(finalEmail, title, message), (error, info) => {
            if (error) {
                callback({
                    message: "Error",
                    payload: error,
                    code: 400
                })
            }
            else {
                callback(null, { message: "Success!", payload: info })
            }
        });
    }
}
