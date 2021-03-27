const Mailgen = require('mailgen')
const sgMail = require('@sendgrid/mail')
const config = require('../config/email.json')
require('dotenv').config()

class EmailService {
    #sender = sgMail
    #GenerateTemplate = Mailgen
    constructor(env) {
        switch (env) {
            case 'development':
                this.link = config.dev
                break
            case 'stage':
                this.link = config.stage
                break
            case 'production':
                this.link = config.prod
                break
            default:
                this.link = config.dev
             break
        }
     }
    #createTemplate(verifyToken, name = 'Guest') {
        const mailGenerator = new this.#GenerateTemplate({
    theme: 'neopolitan',
    product: {
        name: 'test',
        link: this.link,
    }
        });
        const tmpl = {
    body: {
        name,
        intro: 'Hello World',
        action: {
            instructions: 'Click here to complite registration',
            button: {
                color: '#22BC66', // Optional action button color
                text: 'Confirm your account',
                link: `${this.link}/api/users/verify/${verifyToken}`
            },
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
        };
        return mailGenerator.generate(tmpl)
    }
    async sendEmail(verifyToken, email, name) {
        const emailBody = this.#createTemplate(verifyToken, name)
        this.#sender.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
  to: email,
  from: 'yuriev1986@gmail.com', // Use the email address or domain you verified above
  subject: 'My first email',
  html: emailBody,
};
//ES6
await  this.#sender.send(msg)
    }
}

module.exports = EmailService

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
// javascript
// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// const msg = {
//   to: 'test@example.com', // Change to your recipient
//   from: 'test@example.com', // Change to your verified sender
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// }
// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error)
//   })
