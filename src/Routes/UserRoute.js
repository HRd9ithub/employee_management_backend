const express = require("express")
const expressValidator = require("express-validator");
const upload = require("../middleware/ImageProfile");
const { createUser, activeUser, getUser, updateUser, deleteUser, updateStatusUser, checkEmail } = require("../controller/userController");
const Auth = require("../middleware/auth");

const userRoute = express.Router();

// user create api
userRoute.post('/', Auth, [
    expressValidator.body('email', "Enter a valid email.").isEmail(),
    expressValidator.body('firstName', "Enter a valid firstName.").isAlpha(),
    expressValidator.body('lastName', "Enter a valid lastName.").isAlpha(),
    expressValidator.body('postCode', "postcode must be at least 6 character").isLength({ min: 6 }),
    expressValidator.body("phone", "phone number must be at least 10 character").isLength({ min: 10 }),
    expressValidator.body("password", "Password must be at least 6 character ").isLength({ min: 6 })
], createUser)

// active user get api
userRoute.get('/:id', Auth, activeUser);

// user listing api
userRoute.get('/', Auth, getUser);

// update user api
userRoute.put('/:id', Auth, [
    expressValidator.body('email', "Enter a valid email.").isEmail(),
    expressValidator.body('firstName', "Enter a valid firstName.").isAlpha(),
    expressValidator.body('lastName', "Enter a valid lastName.").isAlpha(),
    expressValidator.body('postCode', "postcode must be at least 6 character").isLength({ min: 6 }),
    expressValidator.body("phone", "phone number must be at least 10 character").isLength({ min: 10 }),
    expressValidator.body("password", "Password must be at least 6 character ").isLength({ min: 6 })
], updateUser);

// DELETE user api
userRoute.delete('/:id', Auth, deleteUser)

// upadte user status api
userRoute.patch('/:id', Auth, updateStatusUser)

//check email  api
userRoute.post('/email', [expressValidator.body('email', "Enter a valid email.").isEmail()], Auth, checkEmail)

module.exports = userRoute