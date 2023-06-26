const express = require("express")
const expressValidator = require("express-validator");
const { userLogin, verifyOtp, mailSend, resetPassword, userLogout } = require("../controller/loginController");
const Auth = require("../middleware/auth");
const AuthRoute = express.Router();

// login api 
AuthRoute.post('/login', [
    expressValidator.body('email', "Enter a valid email.").isEmail(),
    expressValidator.body("password", "Password must be at least 6 character ").isLength({ min: 6 })
],userLogin)

// otp verification api
AuthRoute.patch('/otp', [expressValidator.body('email', "Enter a valid email.").isEmail(),
expressValidator.body("otp", "Otp must be at least 4 character ").isLength({ min: 4 })],verifyOtp )

// forget password for email verification and send reset link for email api
AuthRoute.post('/forgotPassword', [
    expressValidator.body('email', "Enter a valid email.").isEmail()
],mailSend)

// reset password api
AuthRoute.post('/resetpassword',Auth, [
    expressValidator.body('email', "Enter a valid email.").isEmail(),
    expressValidator.body("password", "Password must be at least 6 character ").isLength({ min: 6 })
],resetPassword)

// logout  api
AuthRoute.post('/logout',Auth,userLogout)



module.exports = AuthRoute