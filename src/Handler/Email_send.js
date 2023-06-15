
var nodemailer = require('nodemailer')
const { SMTP_EMAIL, SMTP_PASSWORD } = process.env

const sendMail = async (email, mailsubject, content) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: SMTP_EMAIL,
                pass: SMTP_PASSWORD
            }
        })
        var mailOptions = {
            from: SMTP_EMAIL,
            to: email,
            subject: mailsubject,
            html: content
        };

        transporter.sendMail(mailOptions, function (error, info) {
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