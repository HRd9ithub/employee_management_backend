const express = require("express")
const expressValidator = require("express-validator");
const { userLogin, verifyOtp, mailSend, resetPassword, userLogout, ResendOtp, checkLink } = require("../controller/loginController");
const Auth = require("../middleware/auth");
const AuthRoute = express.Router();

// login api 
AuthRoute.post('/login', [
    expressValidator.body('email', "Enter a valid email.").isEmail(),
    expressValidator.body("password", "Password must be at least 8 character ").isLength({ min: 8 })
],userLogin)

// otp verification api
AuthRoute.patch('/otp', [expressValidator.body('email', "Enter a valid email.").isEmail(),
expressValidator.body("city", "city is required. ").notEmpty(),
expressValidator.body("device", "device is required.").notEmpty(),
expressValidator.body("browser_name", "browser name is required.").notEmpty(),
expressValidator.body("ip", "ip is required.").notEmpty(),
expressValidator.body("otp", "otp is required.").notEmpty().custom(async (otp, { req }) => {
    if (otp && otp.length != 4) {
        throw new Error('OTP must bet 4 characters.')
    }
}),
],verifyOtp )


// resend otp api 
AuthRoute.patch('/resendOtp', [
    expressValidator.body('email', "Enter a valid email.").isEmail(),
],ResendOtp)

// forget password for email verification and send reset link for email api
AuthRoute.post('/forgotPassword', [
    expressValidator.body('email', "Enter a valid email.").isEmail()
],mailSend)

// reset password api
AuthRoute.post('/resetpassword', [
    expressValidator.body('email', "Enter a valid email.").isEmail(),
    expressValidator.body("password", "Password must be at least 6 character ").isLength({ min: 6 })
],resetPassword)

// reset password api
AuthRoute.get('/checklink',checkLink)

// logout  api
AuthRoute.post('/logout',Auth,userLogout)



module.exports = AuthRoute