const express = require("express")
var bodyParser = require('body-parser');
const expressValidator = require("express-validator");
const upload = require("../middleware/ImageProfile");
const { createUser, activeUser, getUser, updateUser, deleteUser, updateStatusUser, checkEmail, checkEmployeeId, changeImage, changePassword } = require("../controller/userController");
const Auth = require("../middleware/auth");
const user = require("../models/UserSchema");

const userRoute = express.Router();

userRoute.use(bodyParser.json())

userRoute.use(bodyParser.urlencoded({ extended: false }));

// user create api
userRoute.post('/', Auth, [
    expressValidator.body('email').isEmail().withMessage("Enter a valid email.").custom(async (email, { req }) => {
        const data = await user.findOne({ email: { $regex: new RegExp('^' + req.body.email, 'i') } })

        if (data) {
            throw new Error("Email address already exists.")
        }
    }),
    expressValidator.body('first_name', "Enter a valid firstName.").isAlpha(),
    expressValidator.body('last_name', "Enter a valid lastName.").isAlpha(),
    expressValidator.body("phone", "phone number must be at least 10 character").isLength({ min: 10, max: 10 }),
    expressValidator.body('password').notEmpty().withMessage("Password is Required.").custom(async (password, { req }) => {
        if (password && !password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)) {
            throw new Error('Password is Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.')
        }
    }),
    expressValidator.body('employee_id').custom(async (id, { req }) => {
        const employee_id = await user.findOne({ employee_id: { $regex: new RegExp('^' + req.body.employee_id, 'i') } })

        if (!id) {
            throw new Error('Employee id is Required.')
        } else if (employee_id) {
            throw new Error('Employee id already exists.')
        }
    }),
    expressValidator.body('joining_date', "Invalid Joining Date format.Please enter the date in the format 'DD-MM-YYYY'.").isDate({ format: 'DD-MM-YYYY' }),
    expressValidator.body('status', "Please Enter valid status.").isIn(["Active", "Inactive"]),
    expressValidator.body('role_id', "Please Enter valid roleId.").isMongoId(),
    expressValidator.body('department_id', "Please Enter valid departmentId.").isMongoId(),
    expressValidator.body('designation_id', "Please Enter valid designationId.").isMongoId(),
    expressValidator.body('report_to', "Please enter valid report to.").isMongoId(),
], createUser)

// active user get api
userRoute.get('/:id', Auth, activeUser);

// user listing api
userRoute.get('/', Auth, getUser);

// update user api
userRoute.put('/:id', Auth, updateUser);

// DELETE user api
userRoute.delete('/:id', Auth, deleteUser)

// update user status api
userRoute.patch('/:id', Auth, updateStatusUser)

//check email  api
userRoute.post('/email', Auth, [expressValidator.body('email', "Enter a valid email.").isEmail()], checkEmail)

// check employee id
userRoute.post('/employeeId', Auth, [expressValidator.body('employee_id', "Employee Id is Required.").notEmpty()], checkEmployeeId)

// change profile image
userRoute.post('/image', Auth, changeImage);

// change password image
userRoute.post('/password', Auth, [
    expressValidator.body('current_password').notEmpty().withMessage("Current Password is Required.").custom(async (current_password, { req }) => {
        if (current_password && !current_password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)) {
            throw new Error('Current password is Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.')
        }
    }),
    expressValidator.body('new_password').notEmpty().withMessage("New Password is Required.").custom(async (new_password, { req }) => {
        if (new_password && !new_password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)) {
            throw new Error('New password is Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character.')
        }
    }),
    expressValidator.body('confirm_password').notEmpty().withMessage("Confirm Password is Required.").custom(async (confirmPassword, { req }) => {
        const password = req.body.new_password
        // If password and confirm password not same
        // don't allow to sign up and throw error
        if (password !== confirmPassword) {
            throw new Error('New Password and Confirm Password does not match.')
        }
    }),
], changePassword);


module.exports = userRoute