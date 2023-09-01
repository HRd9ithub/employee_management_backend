const express = require("express")
const expressValidator = require("express-validator");
const Auth = require("../middleware/auth");
const { createLeaveType,checkLeaveType ,getLeaveType, deleteLeaveType, updateLeaveType} = require("../controller/leaveTypeController");

const leaveTypeRoute = express.Router();

// create Holiday api
leaveTypeRoute.post('/', Auth,[expressValidator.body("name","Leave type name is Required.").notEmpty()], createLeaveType);

// update Holiday api
leaveTypeRoute.patch('/:id',[expressValidator.body("name","Leave type name is Required.").notEmpty()],Auth,updateLeaveType);

// delete Holiday api
leaveTypeRoute.delete('/:id',Auth,deleteLeaveType);

// get Holiday api
leaveTypeRoute.get('/',Auth,getLeaveType);

// check DEPARTMENT
leaveTypeRoute.post('/name', Auth, [expressValidator.body("name","Leave type name is Required.").notEmpty()],checkLeaveType)

module.exports = leaveTypeRoute;