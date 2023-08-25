
const hbs = require('nodemailer-express-handlebars')
const nodemailer = require('nodemailer')
const path = require('path')
const { SMTP_EMAIL, SMTP_PASSWORD } = process.env

const forgetEmail = async (email, mailsubject, url,name) => {
    try {
        // const transporter = nodemailer.createTransport({
        //     host: 'smtp.gmail.com',
        //     port: 587,
        //     auth: {
        //         user: SMTP_EMAIL,
        //         pass: SMTP_PASSWORD
        //     }
        // })
        var transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: SMTP_EMAIL,
                pass: SMTP_PASSWORD
            }
        });

        // point to the template folder
        const handlebarOptions = {
            viewEngine: {
                partialsDir: path.resolve('./views/'),
                defaultLayout: false,
            },
            viewPath: path.resolve('./views/'),
        };

        // use a template file with nodemailer
        transporter.use('compile', hbs(handlebarOptions))

        var mailOptions = {
            from: SMTP_EMAIL,
            to: email,
            subject: mailsubject,
            template: 'email', // the name of the template file i.e email.handlebars
            context: {
                name: name, // replace {{name}} with Adebola
                action_url: url // replace {{company}} with My Company
            }
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