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
    expressValidator.body("password", "Password must be at least 6 character ").isLength({ min: 6 }),
    expressValidator.body('age', "Please Enter your age.").notEmpty(),
    expressValidator.body('address', "Please Enter your address.").notEmpty(),
    expressValidator.body('gender', "Please Enter your gender.").notEmpty(),
    expressValidator.body('dateOfBirth', "Please Enter your dateOfBirth.").notEmpty(),
    expressValidator.body('joiningDate', "Please Enter your joiningDate.").notEmpty(),
    expressValidator.body('bloodGroup', "Please Enter your bloodGroup.").notEmpty(),
    expressValidator.body('status', "Please Enter your status.").notEmpty(),
    expressValidator.body('city', "Please Enter your city.").notEmpty(),
    expressValidator.body('country', "Please Enter your country.").notEmpty(),
    expressValidator.body('state', "Please Enter your state.").notEmpty(),
    expressValidator.body('roleId', "Please Enter your roleId.").notEmpty(),
    expressValidator.body('departmentId', "Please Enter your departmentId.").notEmpty(),
    expressValidator.body('designationId', "Please Enter your designationId.").notEmpty(),

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