const express = require("express")
// const {projectPermission } = require("../middleware/permission");
// const { createProject, getProject, updateProject, deleteProject } = require("../controller/projectController");
const { check } = require("express-validator");
const Auth = require("../middleware/auth");
const { createReport, getReport, updateReport } = require("../controller/workReportController");
const { reportPermission } = require("../middleware/permission");

const workReportRoute = express.Router();

let workReportValidation = [
    check("date", "Invalid Date format.Please enter the date in the format 'YYYY-MM-DD'.").isDate({ format: "YYYY-MM-DD" }),
    check("totalHours", "Total hours is a required field.").notEmpty(),
    check('work', "Insert values ​​into the array.").isArray(),
    check('work.*.projectId', "Project is a required field.").notEmpty(),
    check('work.*.description', "Description is a required field.").notEmpty(),
    check('work.*.hours', "Working hours is a required field.").notEmpty().custom(async (totalHours, { req }) => {
        if (totalHours && (totalHours.toString() > 24 || totalHours.toString() < 1)) {
            throw new Error('Working hours range from 1 to 24 hours.')
        }
    })
]

// create Project api
workReportRoute.post('/', Auth, reportPermission, workReportValidation, createReport);

// create Project api
workReportRoute.patch('/:id', Auth, reportPermission, workReportValidation, updateReport);

// get Project api
workReportRoute.get('/', Auth, reportPermission, getReport);


module.exports = workReportRoute