const expressValidator = require("express-validator");
const bcrypt = require("bcryptjs")
const user = require("../models/UserSchema");
const sendMail = require("../Handler/Email_send");
var jwt = require('jsonwebtoken');

// user login function
const userLogin = async (req, res) => {
    try {
        const errors = expressValidator.validationResult(req);
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array(), success: false })
        }

        // email check exist or not
        const userData = await user.findOne({ email: req.body.email })
        console.log('userData====>', userData)
        if (userData && userData.status !== 'Inactive') {
            // password compare
            let isMatch = await bcrypt.compare(req.body.password, userData.password);
            if (isMatch) {
                let mailsubject = 'Mail Verification';
                let otp = Math.random().toString().slice(3, 7);

                otp.length < 4 ? otp = otp + "3" : otp;
                // mail content
                let content = `<h4><b>D9ithub</b></h4> \
                            <hr/> \
                            <p>hi</p>\
                      <p>Thank you for choosing Your Brand. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes
                      : <b> ${otp} </b> </p>
                    `
                // mail send function
                sendMail(req.body.email, mailsubject, content);

                console.log('otp', otp)
                // update data for otp
                const response = await user.findByIdAndUpdate({ _id: userData._id }, { otp }, { new: true })
                return res.status(200).json({ success: true, message: "Otp send successfully.",data:response.email })
            } else {
                // password not match send message
                return res.status(400).json({ message: "Invalid email or password.", success: false })
            }
        } else {
            // email not match send message
            return res.status(404).json({ message: "Invalid email or password.", success: false })
        }
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

// login otp verify
const verifyOtp = async (req, res) => {
    try {
        const errors = expressValidator.validationResult(req);
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array(), success: false })
        }

        // get data for email
        const data = await user.findOne({ email: req.body.email });
        if (data.otp == req.body.otp) {
            // generate token
            var token = jwt.sign({ _id: data._id }, process.env.SECRET_KEY);

            // otp match for update otp value null
            const response = await user.findByIdAndUpdate({ _id: data._id }, { otp: null }, { new: true })
            return res.status(200).json({ success: true, message: "Otp verify successfully.", token: token, id: response._id })
        } else {
            // not match send message
            return res.status(400).json({ message: "Invalid OTP entered.",success:false })
        }
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

// forget password send mail
const mailSend = async (req, res) => {
    try {
        const errors = expressValidator.validationResult(req);
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array(), success: false })
        }

        // email check exist or not
        const userData = await user.findOne({ email: req.body.email })

        if (userData) {
            // generate token
            var token = jwt.sign({ _id: userData._id }, process.env.SECRET_KEY);
            let mailsubject = 'Forget Password Mail';
            // mail content
            let content = `<h4><b>D9ithub</b></h4> \
                            <hr/> \
                            <p>hi</p>\
                      <p>Thank you for choosing Your Brand. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes</p>\
                       <a href=http://localhost:3001/newPassword?email=${req.body.email}&token=${token}>Reset Password </a>
                    `
            // mail send function
            sendMail(req.body.email, mailsubject, content);
            return res.status(200).json({ success: true, message: "We have e-mailed your password reset link." })
        } else {
            // email not match send message
            return res.status(400).json({ message: "Email is not exist.", success: false })
        }

    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

// reset password function
const resetPassword = async (req, res) => {
    try {
        const errors = expressValidator.validationResult(req);
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array(), success: false })
        }

        // email check exist or not
        const userData = await user.findOne({ email: req.body.email })

        if (userData.email == req.user.email) {
            // password convert hash
            let passwordHash = await bcrypt.hash(req.body.password, 10)
            const response = await user.findByIdAndUpdate({ _id: userData._id }, { password: passwordHash }, { new: true })
            return res.status(200).json({ success: true, message: "Your password has been changed successfully." })
        } else {
            return res.status(404).json({ success: false, message: "Your password has been changed failed." })
        }
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

module.exports = { userLogin, verifyOtp, mailSend, resetPassword }