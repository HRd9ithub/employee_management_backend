const express = require("express")
const expressValidator = require("express-validator");
const upload = require("../middleware/ImageProfile");
const { createUser, activeUser, getUser, updateUser, deleteUser, updateStatusUser, checkEmail, checkEmployeeId } = require("../controller/userController");
const Auth = require("../middleware/auth");

const userRoute = express.Router();

// user create api
userRoute.post('/', [
    expressValidator.body('email', "Enter a valid email.").isEmail(),
    expressValidator.body('firstName', "Enter a valid firstName.").isAlpha(),
    expressValidator.body('lastName', "Enter a valid lastName.").isAlpha(),
    expressValidator.body("phone", "phone number must be at least 10 character").isLength({ min: 10 }),
    expressValidator.body("password", "Password must be at least 6 character ").isLength({ min: 6 }),
    expressValidator.body('employee_id', "Please Enter empolyee id.").notEmpty(),
    expressValidator.body('joiningDate', "Please Enter joiningDate.").notEmpty(),
    expressValidator.body('status', "Please Enter status.").notEmpty(),
    expressValidator.body('roleId', "Please Enter roleId.").notEmpty(),
    expressValidator.body('departmentId', "Please Enter departmentId.").notEmpty(),
    expressValidator.body('designationId', "Please Enter designationId.").notEmpty(),
    expressValidator.body('reportTo', "Please enter report to.").notEmpty(),

], createUser)

// active user get api
userRoute.get('/:id', activeUser);

// user listing api
userRoute.get('/', getUser);

// update user api
userRoute.put('/:id', updateUser);

// DELETE user api
userRoute.delete('/:id',  deleteUser)

// upadte user status api
userRoute.patch('/:id', updateStatusUser)

//check email  api
userRoute.post('/email', [expressValidator.body('email', "Enter a valid email.").isEmail()], checkEmail)

// check employee id
userRoute.post('/employeeId', [expressValidator.body('employee_id', "Please enter an employee id.").notEmpty()],  checkEmployeeId)

// change profile image
userRoute.post('/image', [expressValidator.body('employee_id', "Please enter an employee id.").notEmpty()],  checkEmployeeId)



module.exports = userRoute