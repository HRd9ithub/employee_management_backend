const expressValidator = require("express-validator");
const bcrypt = require("bcryptjs")
const user = require("../models/UserSchema");
const sendMail = require("../Handler/Email_send");
var jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const loginInfo = require("../models/loginInfoSchema");
const timeSheet = require("../models/timeSheetSchema");
const forgetEmail = require("../Handler/forgetEmail");
const TokenSchema = require("../models/TokenSchema");

const addTime = async (id) => {
    try {
        let data = await timeSheet.findOne({ user_id: id, date: new Date().toLocaleDateString() });
        console.log(data, "data")
        if (!data) {
            let Hours = new Date().getHours();
            let Minutes = new Date().getMinutes();
            let login_time = Hours + ":" + Minutes;

            // add data database
            const timeData = new timeSheet({
                user_id: id,
                date: new Date().toLocaleDateString(),
                login_time: login_time
            });

            await timeData.save();
        }
        return true
    } catch (error) {
        console.log(error)
    }
}

// user login function
const userLogin = async (req, res) => {
    try {
        const errors = expressValidator.validationResult(req);

        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: err, success: false })
        }

        // email check exist or not
        const userData = await user.findOne({ email: req.body.email })
        if (userData && userData.status !== 'Inactive' && !userData.deleteAt) {
            // password compare
            let isMatch = await bcrypt.compare(req.body.password, userData.password);
            if (isMatch) {
                let mailsubject = 'Mail Verification';
                // let otp = Math.random().toString().slice(3, 5);
                // otp.length < 4 ? otp = otp.padEnd(4, "0") : otp;
                let otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
                // mail content
                let content = `<div style="font-family: Helvetica,Arial,sans-serif;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                  <div style="border-bottom:1px solid #eee">
                    <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">D9ithub</a>
                  </div>
                  <p style="font-size:1.1em">Hi,</p>
                  <p>Thank you for choosing Your Brand. Use the following OTP to complete your Sign in procedures. OTP is valid for 5 minutes</p>
                  <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                  <p style="font-size:0.9em;">Regards,<br />D9ithub</p>
                </div>
              </div>
                    `
                // mail send function
                sendMail(req.body.email, mailsubject, content);

                // update data for otp
                const response = await user.findByIdAndUpdate({ _id: userData._id }, { otp, expireIn: new Date().getTime() + 5 * 60000,$unset: {token :1} }, { new: true })
                return res.status(200).json({ success: true, message: "Otp send successfully.", data: response.email })
            } else {
                // password not match send message
                return res.status(400).json({ message: "Invalid email or password.", success: false })
            }
        }

        if (userData && userData.status === 'Inactive') {
            return res.status(400).json({ message: "Please contact admin in status is inactive.", success: false })
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
        console.log(req.body)

        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: err, success: false })
        }

        // get data for email
        const data = await user.findOne({ email: req.body.email, otp: req.body.otp });
        console.log(data)
        if (data) {
            let currTime = new Date().getTime()
            let diff = data.expireIn - currTime
            console.log(diff)
            if (diff < 0) {
                await user.findByIdAndUpdate({ _id: data._id }, { $unset: { otp: 1, expireIn: 1 } }, { new: true })
                return res.status(400).json({ message: "OTP has expired.", success: false })
            }
            // generate token
            const token = await data.generateToken();
            const loginData = new loginInfo({
                userId: data._id,
                city: req.body.city,
                device: req.body.device,
                device_name: req.body.device_name,
                ip: req.body.ip,
                browser_name: req.body.browser_name
            });
            let login = await loginData.save();
            let time = await addTime(data._id)

            if (login && time) {
                // otp match for update otp value null
                const response = await user.findByIdAndUpdate({ _id: data._id }, { $unset: { otp: 1, expireIn: 1 } }, { new: true })
                return res.status(200).json({ success: true, message: "Login successfully.", token: token, id: response._id })
            }
        } else {
            // not match send message
            return res.status(400).json({ message: "Invalid OTP entered.", success: false })
        }
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

// resend otp function
const ResendOtp = async (req, res) => {
    try {
        const errors = expressValidator.validationResult(req);

        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: err, success: false })
        }

        // email check exist or not
        const userData = await user.findOne({ email: req.body.email })
        if (userData) {
            let mailsubject = 'Mail Verification';
            // let otp = Math.random().toString().slice(3, 5);
            // otp.length < 4 ? otp = otp.padEnd(4, "0") : otp;
            let otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
            // mail content
            let content = `<h4><b>D9ithub</b></h4> \
                            <hr/> \
                            <p>hi</p>\
                      <p>Thank you for choosing Your Brand. Use the following OTP to complete your Sign Up procedures. OTP is valid for 5 minutes
                      : <b> ${otp} </b> </p>
                    `
            // mail send function
            sendMail(req.body.email, mailsubject, content);

            // update data for otp
            const response = await user.findByIdAndUpdate({ _id: userData._id }, { otp, expireIn: new Date().getTime() + 5 * 60000 }, { new: true })
            return res.status(200).json({ success: true, message: "Otp send successfully." })
        } else {
            // email not match send message
            return res.status(404).json({ message: "Invalid email.", success: false })
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

        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: err, success: false })
        }

        // email check exist or not
        const userData = await user.findOne({ email: req.body.email })

        if (userData && userData.status === "Active") {
            // generate token
            var token = jwt.sign({ _id: userData._id }, process.env.SECRET_KEY, { expiresIn: "30m" });
            let mailsubject = 'Forget Password Mail';
            // mail content
            let url = `${process.env.RESET_PASSWORD_URL}/newPassword?email=${req.body.email}&token=${token}`
            let name = userData.first_name.concat(" ", userData.last_name)

            // mail send function
            forgetEmail(req.body.email, mailsubject, url, name);
            let tokenData = new TokenSchema({
                email: req.body.email,
                token,
                expireIn: new Date().getTime() + 30 * 60000
            })
            await tokenData.save();
            return res.status(200).json({ success: true, message: "Password reset link sent to your email account." })
        } else {
            if (!userData) {
                // email not match send message
                return res.status(400).json({ message: "Email is not exist.", success: false })
            } else {
                return res.status(400).json({ message: "This user is Inactive.", success: false })
            }
        }
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

// reset password function
const resetPassword = async (req, res) => {
    let verifyUser = ""
    try {
        const errors = expressValidator.validationResult(req);

        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: err, success: false })
        }
        let token = req.headers['token'];

        const data = await TokenSchema.findOne({
            email: req.body.email,
            token: token,
        });

        if (!data) return res.status(400).json({ success: false, message: "Your Link has expired! please check your email." })

        let currTime = new Date().getTime()
        let diff = data.expireIn - currTime

        if (diff > 0) {

            if (!token) return res.status(400).json({ success: false, message: "Your Link has expired! please check your email." })

            verifyUser = jwt.verify(token, process.env.SECRET_KEY);

            // email check exist or not
            const userData = await user.findOne({ email: req.body.email })

            if (userData) {
                // password convert hash
                let passwordHash = await bcrypt.hash(req.body.password, 10)
                const response = await user.findByIdAndUpdate({ _id: userData._id }, { password: passwordHash }, { new: true })
                await TokenSchema.deleteOne({ _id: data._id })
                return res.status(200).json({ success: true, message: "Password reset sucessfully." })
            } else {
                return res.status(400).json({ success: false, message: "Your password has been reset failed." })
            }
        } else {
            return res.status(400).json({ success: false, message: "Your Link has expired! please check your email." })
        }
    } catch (error) {
        console.log('error', error)
        if (!verifyUser) return res.status(400).json({ success: false, message: "Your Link has expired! please check your email." })
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

// check link reset password link
const checkLink = async (req, res) => {
    try {
        let token = req.headers['token'];

        if (!token) return res.status(400).json({ success: false, message: "Your Link has expired! please check your email." })

        const data = await TokenSchema.findOne({
            token: token,
        });
        console.log(data)

        if (!data) return res.status(400).json({ success: false, message: "Your Link has expired! please check your email." })

        let currTime = new Date().getTime()
        let diff = data.expireIn - currTime

        if (diff < 0) {
            return res.status(400).json({ success: false, message: "Your Link has expired! please check your email." })
        } else {
            return res.status(200).json({ success: true, message: "not expired for link." })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

// logout  function
const userLogout = async (req, res) => {
    try {
        if (req.user) {
            let data = await timeSheet.findOne({ user_id: req.user._id, date: new Date().toLocaleDateString() });
            console.log(data, "data")
            if (data) {
                let Hours = new Date().getHours();
                let Minutes = new Date().getMinutes();
                let logout_time = Hours + ":" + Minutes;

                const response = await timeSheet.findByIdAndUpdate({ _id: data._id }, logout_time, { new: true })

                await user.findByIdAndUpdate({ _id: req.user._id }, { $unset: { token: 1 } }, { new: true })
                return res.status(200).json({ success: true, message: "Logout is successfully." })
            }
            else {
                return res.status(404).json({ success: false, message: "Logout is failed." })
            }
        } else {
            return res.status(404).json({ success: false, message: "Logout is failed." })
        }
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

module.exports = { userLogin, verifyOtp, mailSend, resetPassword, userLogout, ResendOtp,checkLink }