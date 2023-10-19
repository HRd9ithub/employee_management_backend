const nodemailer = require('nodemailer');
const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const { SMTP_EMAIL, SMTP_PASSWORD } = process.env

const forgetEmail = async (email, mailsubject, url) => {
    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            auth: {
                user: SMTP_EMAIL,
                pass: SMTP_PASSWORD
            }
        })

        // get file path
        let filepath = path.resolve(__dirname, "../../views/forgotPassword.ejs");

        // read file using fs module
        let htmlstring = fs.readFileSync(filepath).toString();
        // add data dynamic
        let content = ejs.render(htmlstring, {action_url: url });

        let from = `D9ithub <${SMTP_EMAIL}>`
        var mailOptions = {
            from: from,
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

module.exports = forgetEmail;