const express = require("express")
const expressValidator = require("express-validator");
const Auth = require("../middleware/auth");
const { createDepartment, updateDepartment, deleteDepartment,getDepartment, checkDepartment } = require("../controller/departmentController");

const departmentRoute = express.Router();

// create department api
departmentRoute.post('/',Auth,[expressValidator.body("name","Department name is Required.").notEmpty()],createDepartment);

// update department api
departmentRoute.patch('/:id',Auth,[expressValidator.body("name","Department name is Required.").notEmpty()],updateDepartment);

// delete department api
departmentRoute.delete('/:id',Auth,deleteDepartment);

// get department api
departmentRoute.get('/',Auth,getDepartment);


// check DEPARTMENT
departmentRoute.post('/name', Auth, [expressValidator.body("name","Department name is Required.").notEmpty()],checkDepartment)


module.exports = departmentRoute