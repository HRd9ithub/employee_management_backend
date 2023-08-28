const express = require("express")
const expressValidator = require("express-validator");
const Auth = require("../middleware/auth");
const { addAccount } = require("../controller/accountController");
const accountRoute = express.Router();

// account detail add api
accountRoute.post('/', Auth, [
    expressValidator.body('bank_name', "Bank name field is required.").notEmpty(),
    expressValidator.body('user_id', "User id is Required.").isMongoId(),
    expressValidator.body('branch_name', "Branch name field is required.").notEmpty(),
    expressValidator.body('name', "Name field is required.").notEmpty(),
    expressValidator.body("account_number", "Account number is Required.").notEmpty().custom(async (account_number, { req }) => {
        if (account_number && account_number.toString().length < 12) {
            throw new Error('Account number must be at least 12 character.')
        }
    }),
    expressValidator.body("ifsc_code", "IFSC code is Required.").notEmpty().custom(async (ifsc_code, { req }) => {
        if (ifsc_code && ifsc_code.toString().length !== 11) {
            throw new Error('IFSC code must be at least 11 character.')
        }
    })], addAccount)


module.exports = accountRoute