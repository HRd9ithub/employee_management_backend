const express = require("express")
const expressValidator = require("express-validator");
const Auth = require("../middleware/auth");
const { createDepartment, updateDepartment, deleteDepartment,getDepartment } = require("../controller/departmentController");

const departmentRoute = express.Router();

// create department api
departmentRoute.post('/',Auth,createDepartment);

// update department api
departmentRoute.patch('/:id',Auth,updateDepartment);

// delete department api
departmentRoute.delete('/:id',Auth,deleteDepartment);

// get department api
departmentRoute.get('/',Auth,getDepartment);


module.exports = departmentRoute