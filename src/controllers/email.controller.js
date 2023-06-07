import nodemailer from 'nodemailer';
import config from '../config/config.js';

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.gmailAccount,
        pass: config.gmailAppPassword
    }
});

transporter.verify(function (error, success) {
    if (error) {
        console.warn(`Transporter verify error:  ${error} `);
    } else {
        console.info(`Server is ready to take our messages.`);
    }
});

const mailOptions = (receiver) => {
    return {
        from: "Coder Test " + config.gmailAccount,
        to: receiver,
        subject: "JPLARUSSA Test Mail Backend Programming project.",
        html: "<div><h1>This is a test of sending emails with Nodemailer!</h1></div>",
        attachments: []
    }
}


export const sendEmail = (req, res) => {
    try {
        const { email } = req.user
        let finalEmail = email ? email : config.gmailAccount;
        let result = transporter.sendMail(mailOptions(finalEmail), (error, info) => {
            if (error) {
                res.status(400).send({ message: "Error", payload: error });
            }
            req.logger.console.info(`Message sent: %s ${info.messageId}`);
            res.send({ message: "Success!", payload: info });
        });
    } catch (error) {
        req.logger.console.warn(`Send email error:  ${error} `);
        res.status(500).send({ error: error, message: "Could not send email from:" + config.gmailAccount });
    }
};