const express = require("express")
const Auth = require("../middleware/auth");
const { createleaveType ,getleaveType, deleteleaveType, updateleaveType} = require("../controller/leaveTypeController");

const leaveTypeRoute = express.Router();

// create Holiday api
leaveTypeRoute.post('/', Auth, createleaveType);

// update Holiday api
leaveTypeRoute.patch('/:id',Auth,updateleaveType);

// delete Holiday api
leaveTypeRoute.delete('/:id',Auth,deleteleaveType);

// get Holiday api
leaveTypeRoute.get('/',Auth,getleaveType);


module.exports = leaveTypeRoute;