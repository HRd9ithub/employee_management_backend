const express = require("express")
// const {projectPermission } = require("../middleware/permission");
// const { createProject, getProject, updateProject, deleteProject } = require("../controller/projectController");
const { check } = require("express-validator");
const Auth = require("../middleware/auth");
const { createReport, getReport, updateReport } = require("../controller/workReportController");
const { reportPermission } = require("../middleware/permission");

const workReportRoute = express.Router();

let workReportValidation = [
    check("projectId","Project is a required field.").isMongoId(),
    check("description","Description is a required field.").notEmpty(),
    check("hours","Working hours is a required field.").notEmpty(),
]

// create Project api
workReportRoute.post('/',Auth,reportPermission,workReportValidation,createReport);

// create Project api
workReportRoute.patch('/:id',Auth,reportPermission,workReportValidation,updateReport);

// get Project api
workReportRoute.get('/',Auth,reportPermission,getReport);


module.exports = workReportRoute