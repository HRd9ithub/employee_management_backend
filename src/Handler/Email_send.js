
var nodemailer = require('nodemailer')
const { SMTP_EMAIL, SMTP_PASSWORD } = process.env

const sendMail = async (email, mailsubject, content) => {
    try {
        // const transport = nodemailer.createTransport({
        //     host: 'smtp.gmail.com',
        //     port: 587,
        //     auth: {
        //         user: SMTP_EMAIL,
        //         pass: SMTP_PASSWORD
        //     }
        // })
        var transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: SMTP_EMAIL,
                pass: SMTP_PASSWORD
            }
        });
        let from = `D9ithub <${SMTP_EMAIL}>`
        var mailOptions = {
            from: from,
            to: email,
            subject: mailsubject,
            html: content
        };

        transport.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    } catch (error) {
        console.log(error, "error  ======> send mail file")
    }
}

module.exports = sendMail;