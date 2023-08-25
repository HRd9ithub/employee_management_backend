const express = require("express")
var bodyParser = require('body-parser');
const expressValidator = require("express-validator");
const upload = require("../middleware/ImageProfile");
const { createUser, activeUser, getUser, updateUser, deleteUser, updateStatusUser, checkEmail, checkEmployeeId, changeImage } = require("../controller/userController");
const Auth = require("../middleware/auth");

const userRoute = express.Router();

userRoute.use(bodyParser.json()) 

userRoute.use(bodyParser.urlencoded({ extended: false })); 

// user create api
userRoute.post('/',Auth, [
    expressValidator.body('email', "Enter a valid email.").isEmail(),
    expressValidator.body('first_name', "Enter a valid firstName.").isAlpha(),
    expressValidator.body('last_name', "Enter a valid lastName.").isAlpha(),
    expressValidator.body("phone", "phone number must be at least 10 character").isLength({ min: 10 ,max:10}),
    expressValidator.body("password", "Password must be at least 8 character ").isLength({ min: 8 }),
    expressValidator.body('employee_id', "Please Enter empolyee id.").notEmpty(),
    expressValidator.body('joining_date', "Please Enter joiningDate.").notEmpty(),
    expressValidator.body('status', "Please Enter status.").notEmpty(),
    expressValidator.body('role_id', "Please Enter roleId.").notEmpty(),
    expressValidator.body('department_id', "Please Enter departmentId.").notEmpty(),
    expressValidator.body('designation_id', "Please Enter designationId.").notEmpty(),
    expressValidator.body('report_to', "Please enter report to.").notEmpty(),
],upload.single("profile_image"), createUser)

// active user get api
userRoute.get('/:id',Auth, activeUser);

// user listing api
userRoute.get('/',Auth, getUser);

// update user api
userRoute.put('/:id',Auth, updateUser);

// DELETE user api
userRoute.delete('/:id',Auth,  deleteUser)

// upadte user status api
userRoute.patch('/:id',Auth, updateStatusUser)

//check email  api
userRoute.post('/email',Auth, [expressValidator.body('email', "Enter a valid email.").isEmail()], checkEmail)

// check employee id
userRoute.post('/employeeId',Auth,  [expressValidator.body('employee_id', "Please enter an employee id.").notEmpty()],  checkEmployeeId)

// change profile image
userRoute.post('/image',Auth,upload.single("profile_image") ,changeImage);





module.exports = userRoute