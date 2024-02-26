const nodemailer = require('nodemailer');

class MailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            },
            tls: {
                rejectUnauthorized: false,
            }
        });
    }

    async sendMail(to, subject, text) {
        try {
            const mailOptions = {
                from: process.env.MAIL_USER,
                to: to,
                subject: subject,
                text: text
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('E-mail envoyé: ', info.messageId);
            return info;
        } catch (error) {
            console.error('Erreur lors de l\'envoi de l\'e-mail: ', error);
            throw error;
        }
    }
}

module.exports = MailService;
