const express = require("express")
const expressValidator = require("express-validator");
const { userLogin, verifyOtp, mailSend, resetPassword } = require("../controller/loginController");
const Auth = require("../middleware/auth");
const { addAccount } = require("../controller/accountControoler");
const accountRoute = express.Router();

// account detail add api
accountRoute.post('/', Auth,[
    expressValidator.body('bankName', "bank name field is required.").notEmpty(),
    expressValidator.body('branchName', "branch name field is required.").notEmpty(),
    expressValidator.body('name', "name field is required.").notEmpty(),
    expressValidator.body("accountNumber", "account number must be at least 12 character ").isLength({ min: 12 }),
    expressValidator.body("IFSC_Code", "IFSC_Code must be at least 11 character ").isLength({ min: 11,max:11 })
],addAccount)

// otp verification api
// AuthRoute.patch('/otp', [expressValidator.body('email', "Enter a valid email.").isEmail(),
// expressValidator.body("otp", "Otp must be at least 4 character ").isLength({ min: 4 })],verifyOtp )

// // forget password for email verification and send reset link for email api
// AuthRoute.post('/forgotPassword', [
//     expressValidator.body('email', "Enter a valid email.").isEmail()
// ],mailSend)

// // reset password api
// AuthRoute.post('/resetpassword',Auth, [
//     expressValidator.body('email', "Enter a valid email.").isEmail(),
//     expressValidator.body("password", "Password must be at least 6 character ").isLength({ min: 6 })
// ],resetPassword)



module.exports = accountRoute