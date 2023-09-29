const expressValidator = require("express-validator");
const bcrypt = require("bcryptjs")
const user = require("../models/UserSchema");
const sendMail = require("../Handler/Email_send");
var jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const loginInfo = require("../models/loginInfoSchema");
const timeSheet = require("../models/timeSheetSchema");
const forgetEmail = require("../Handler/forgetEmail");
const tokenSchema = require("../models/TokenSchema");
const role = require("../models/roleSchema");
const moment = require("moment");
const Leave = require("../models/leaveSchema");

const addTime = async (id, login) => {
    try {
        let data_detail = await timeSheet.findOne({ user_id: id, date: moment(new Date()).format("YYYY-MM-DD") });

        if (!data_detail) {
            let Hours = new Date().getHours();
            let Minutes = new Date().getMinutes();
            let second = new Date().getSeconds();
            let date = moment(new Date()).format("YYYY-MM-DD")
            let login_time = Hours + ":" + Minutes + ":" + second;

            // add data database
            const timeData = new timeSheet({
                user_id: id,
                date,
                login_time: login_time,
                login_id: login
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
        const userData = await user.findOne({ email: req.body.email , joining_date: {$lte: moment(new Date()).format("YYYY-MM-DD")}})
        if (userData) {
            // password compare
            let isMatch = await bcrypt.compare(req.body.password, userData.password);
            if (isMatch) {

                if (userData.status !== 'Inactive' && !userData.delete_at && (!userData.leaveing_date || moment(userData.leaveing_date).format("YYYY-MM-DD") > moment(new Date()).format("YYYY-MM-DD"))) {

                    let mailsubject = 'Verification Code';
                    // let otp = Math.random().toString().slice(3, 5);
                    // otp.length < 4 ? otp = otp.padEnd(4, "0") : otp;
                    let otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });

                    // mail content
                    let content = `<table width="100%" cellpadding="0" cellspacing="0" align="center" style="text-align: left;font-family: 'Philosopher', sans-serif;margin: 1.875rem auto;">
            <tr>
              <td width="100%" valign="top" bgcolor="#fff">
                <table width="550" cellpadding="0" cellspacing="0" align="center" style="padding:1rem 1.2rem; margin:0 auto; border: 1px solid lightgray;">
                    <tr>
                        <td style="text-align: center;">
                            <img src="https://i.ibb.co/bBgvFbJ/email-otp-1.png" style="height: 6.875rem;padding: .625rem 0;">
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center;">
                          <h2 style="margin-top: 0px">Verification Code</h2>
                        </td>
                    </tr>
                    <tr style="width: 100%; text-align:center;">
                        <table style="width: 100%;">
                            <tr style="font-size: 1rem;padding-left: 1.25rem;font-weight: 600;">
                                <td style="padding: .625rem;">
                                    <p style="color: #000000;font-size: .9375rem;font-weight: 500;text-align:justify;">
                                        <strong>It seems you are login and tring to verify. Here is your One Time Password to validate your user login with D9ithub.</strong>
                                    </p>
                                    <a href={{action_url}} style="font-size:1.2rem;box-sizing: border-box;border-radius: .25rem;color: #fff;display: inline-block;overflow: hidden;text-decoration: none;background-color: #084c89;border-bottom: .5rem solid #084c89;border-left: 1.125rem solid #084c89;border-right: 1.125rem solid #084c89;border-top: .5rem solid #084c89;">${otp}</a>
                                    <p style="color: #000000;font-size: .9375rem;font-weight: 500; margin-bottom: 0;">
                                        <strong>OTP is valid for 5 min only.</strong>
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style="border-top:1px solid #e5e5e5"></td>
                            </tr>
                            <tr style="font-size: 1rem;padding-left: 1.25rem;font-weight: 600;">
                                <td style="padding: .625rem 0 0;">
                                    <p style="text-align: center;color: #000000;font-size: .9375rem;font-weight: 500; margin: 0px">
                                        If you have not try to login, please contact your administrator.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </tr>
                </table>
              </td>
            </tr>
        </table>`

                    // mail send function
                    sendMail(req.body.email, mailsubject, content);

                    // update data for otp
                    const response = await user.findByIdAndUpdate({ _id: userData._id }, { otp, expireIn: new Date().getTime() + 5 * 60000, $unset: { token: 1 } }, { new: true })
                    return res.status(200).json({ success: true, message: "OTP sent successfully.", data: response.email })
                }
            } else {
                // password not match send message
                return res.status(404).json({ message: "Invalid email or password.", success: false })
            }
        }else {
            // email not match send message
            return res.status(404).json({ message: "Invalid email or password.", success: false })
        }

        if (userData && userData.status === 'Inactive' && !userData.delete_at) {
            return res.status(400).json({ message: "Your account is inactive; please contact your administrator.", success: false })
        } else {
            // email not match send message
            return res.status(404).json({ message: "Invalid email or password.", success: false })
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// login otp verify
const verifyOtp = async (req, res) => {
    try {
        let login = "";
        let time = "";

        const errors = expressValidator.validationResult(req);

        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: err, success: false })
        }

        // get data for email
        const data = await user.findOne({ email: req.body.email, otp: req.body.otp });

        if (data) {
            const role_detail = await role.findOne({ _id: data.role_id });
            let currTime = new Date().getTime()
            let diff = data.expireIn - currTime

            if (diff < 0) {
                await user.findByIdAndUpdate({ _id: data._id }, { $unset: { otp: 1, expireIn: 1 } }, { new: true })
                return res.status(400).json({ message: "OTP has expired.", success: false })
            }

            // generate token
            const token = await data.generateToken();
            if (role_detail.name.toLowerCase() !== "admin") {
                const loginData = new loginInfo({
                    userId: data._id,
                    city: req.body.city,
                    device: req.body.device,
                    device_name: req.body.device_name,
                    ip: req.body.ip,
                    browser_name: req.body.browser_name
                });
                login = await loginData.save();
                time = await addTime(data._id, login._id)
            }

            if (role_detail.name.toLowerCase() === "admin" || (login && time)) {
                // otp match for update otp value null
                const response = await user.findByIdAndUpdate({ _id: data._id }, { $unset: { otp: 1, expireIn: 1 } }, { new: true })
                return res.status(200).json({ success: true, message: "You have successfully logged in.", token: token, id: response._id })
            }
        } else {
            // not match send message
            return res.status(400).json({ message: "OTP is invalid.", success: false })
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
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
        const userData = await user.findOne({ email: req.body.email ,joining_date: {$lte: moment(new Date()).format("YYYY-MM-DD")}})
        if (userData && userData.status !== 'Inactive' && !userData.delete_at) {
            let mailsubject = 'Verification Code';

            let otp = otpGenerator.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
            // mail content
            let content = `<table width="100%" cellpadding="0" cellspacing="0" align="center" style="text-align: left;font-family: 'Philosopher', sans-serif;margin: 1.875rem auto;">
            <tr>
              <td width="100%" valign="top" bgcolor="#fff">
                <table width="550" cellpadding="0" cellspacing="0" align="center" style="padding:1rem 1.2rem; margin:0 auto; border: 1px solid lightgray;">
                    <tr>
                        <td style="text-align: center;">
                            <img src="https://i.ibb.co/bBgvFbJ/email-otp-1.png" style="height: 6.875rem;padding: .625rem 0;">
                        </td>
                    </tr>
                    <tr>
                        <td style="text-align: center;">
                          <h2 style="margin-top: 0px">Verification Code</h2>
                        </td>
                    </tr>
                    <tr style="width: 100%; text-align:center;">
                        <table style="width: 100%;">
                            <tr style="font-size: 1rem;padding-left: 1.25rem;font-weight: 600;">
                                <td style="padding: .625rem;">
                                    <p style="color: #000000;font-size: .9375rem;font-weight: 500;text-align:justify;">
                                        <strong>It seems you are login and tring to verify. Here is your One Time Password to validate your user login with D9ithub.</strong>
                                    </p>
                                    <a href={{action_url}} style="font-size:1.2rem;box-sizing: border-box;border-radius: .25rem;color: #fff;display: inline-block;overflow: hidden;text-decoration: none;background-color: #084c89;border-bottom: .5rem solid #084c89;border-left: 1.125rem solid #084c89;border-right: 1.125rem solid #084c89;border-top: .5rem solid #084c89;">${otp}</a>
                                    <p style="color: #000000;font-size: .9375rem;font-weight: 500; margin-bottom: 0;">
                                        <strong>OTP is valid for 5 min only.</strong>
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td style="border-top:1px solid #e5e5e5"></td>
                            </tr>
                            <tr style="font-size: 1rem;padding-left: 1.25rem;font-weight: 600;">
                                <td style="padding: .625rem 0 0;">
                                    <p style="text-align: center;color: #000000;font-size: .9375rem;font-weight: 500; margin: 0px">
                                        If you have not try to login, please contact your administrator.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </tr>
                </table>
              </td>
            </tr>
        </table>`
            // mail send function
            sendMail(req.body.email, mailsubject, content);

            // update data for otp
            const response = await user.findByIdAndUpdate({ _id: userData._id }, { otp, expireIn: new Date().getTime() + 5 * 60000 }, { new: true })
            return res.status(200).json({ success: true, message: "OTP sent successfully." })
        } else {
            // email not match send message
            if (userData && userData.status === 'Inactive' && !userData.delete_at) {
                return res.status(400).json({ message: "Your account is inactive; please contact your administrator.", success: false })
            } else {
                // email not match send message
                return res.status(404).json({ message: "Account not found with the provided email.", success: false })
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
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

        if (userData && userData.status === "Active" && (!userData.leaveing_date || moment(userData.leaveing_date).format("YYYY-MM-DD") > moment(new Date()).format("YYYY-MM-DD"))) {
            // generate token
            var token = jwt.sign({ _id: userData._id }, process.env.SECRET_KEY, { expiresIn: "30m" });
            let mailsubject = 'Password Reset Request';
            // mail content
            let url = `${process.env.RESET_PASSWORD_URL}/set_new_password?email=${req.body.email}&token=${token}`
            let name = userData.first_name.concat(" ", userData.last_name)

            // mail send function
            forgetEmail(req.body.email, mailsubject, url, name);
            await tokenSchema.deleteMany({ email: req.body.email })
            let tokenData = new tokenSchema({
                email: req.body.email,
                token,
                expireIn: new Date().getTime() + 30 * 60000
            })
            await tokenData.save();
            return res.status(200).json({ success: true, message: "A password reset link has been emailed to you." })
        } else {
            if (!userData) {
                // email not match send message
                return res.status(404).json({ message: "Account not found with the provided email.", success: false })
            } else {
                if ((moment(userData.leaveing_date).format("YYYY-MM-DD") <= moment(new Date()).format("YYYY-MM-DD"))) {
                    return res.status(400).json({ message: "You are no longer an employee. I'm sorry.", success: false })
                } else {
                    return res.status(400).json({ message: "Your account is inactive; please contact your administrator.", success: false })
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
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
        let TokenArray = req.headers['authorization'];
        if (!TokenArray) return res.status(400).json({ success: false, message: "Token is a required field." })
        let token = TokenArray.split(" ")[1];

        const data = await tokenSchema.findOne({
            email: req.body.email,
            token: token,
        });


        if (!data) return res.status(400).json({ success: false, message: "The reset password link has expired. To reset your password, return to the login page and select 'Forgot Password' to have a new email sent." })

        let currTime = new Date().getTime()
        let diff = data.expireIn - currTime

        if (diff > 0) {

            if (!token) return res.status(400).json({ success: false, message: "The reset password link has expired. To reset your password, return to the login page and select 'Forgot Password' to have a new email sent." })

            verifyUser = jwt.verify(token, process.env.SECRET_KEY);

            // email check exist or not
            const userData = await user.findOne({ email: req.body.email })

            if (userData) {
                // password convert hash
                let passwordHash = await bcrypt.hash(req.body.password, 10)
                const response = await user.findByIdAndUpdate({ _id: userData._id }, { password: passwordHash }, { new: true })
                await tokenSchema.deleteOne({ _id: data._id })
                return res.status(200).json({ success: true, message: "Password reset successfully." })
            } else {
                return res.status(404).json({ success: false, message: "Your password reset has failed." })
            }
        } else {
            return res.status(400).json({ success: false, message: "The reset password link has expired. To reset your password, return to the login page and select 'Forgot Password' to have a new email sent." })
        }
    } catch (error) {
        if (!verifyUser) return res.status(400).json({ success: false, message: "The reset password link has expired. To reset your password, return to the login page and select 'Forgot Password' to have a new email sent." })
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// check link reset password link
const checkLink = async (req, res) => {
    try {
        let TokenArray = req.headers['authorization'];
        if (!TokenArray) return res.status(400).json({ success: false, message: "Token is Required." })
        let token = TokenArray.split(" ")[1];

        if (!token) return res.status(400).json({ success: false, error: "The reset password link has expired. To reset your password, return to the login page and select 'Forgot Password' to have a new email sent." })

        const data = await tokenSchema.findOne({
            token: token,
        });

        if (!data) return res.status(400).json({ success: false, error: "The reset password link has expired. To reset your password, return to the login page and select 'Forgot Password' to have a new email sent." })

        let currTime = new Date().getTime()
        let diff = data.expireIn - currTime

        if (diff < 0) {
            return res.status(400).json({ success: false, error: "The reset password link has expired. To reset your password, return to the login page and select 'Forgot Password' to have a new email sent." })
        } else {
            return res.status(200).json({ success: true, message: "The password reset link has not expired." })
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// logout  function
const userLogout = async (req, res) => {
    try {
        if (req.user) {
            const roleName = await role.findOne({ _id: req.user.role_id }, { name: 1, _id: 0 })
            // get menu data in database
            if (roleName && roleName.name.toLowerCase() !== "admin") {
                let data = await timeSheet.findOne({ user_id: req.user._id, date: moment(new Date()).format("YYYY-MM-DD") });
                // if (data) {
                let Hours = new Date().getHours();
                let Minutes = new Date().getMinutes();
                let second = new Date().getSeconds();
                let logout_time = Hours + ":" + Minutes + ":" + second;
                var total = moment.utc(moment(logout_time, "HH:mm:ss").diff(moment(data.login_time, "HH:mm:ss"))).format("HH:mm")

                const response = await timeSheet.findByIdAndUpdate({ _id: data._id }, { logout_time, total }, { new: true })
                // }
                // else {
                //     return res.status(404).json({ success: false, message: "Logout is failed." })
                // }
            }
            await user.findByIdAndUpdate({ _id: req.user._id }, { $unset: { token: 1 } }, { new: true })
            return res.status(200).json({ success: true, message: "You have successfully logged out." })
        } else {
            return res.status(404).json({ success: false, message: "The logout has failed." })
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

module.exports = { userLogin, verifyOtp, mailSend, resetPassword, userLogout, ResendOtp, checkLink }