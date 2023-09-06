const { Router } = require('express');
const timeSheetRouter = Router(); 
const Auth = require("../middleware/auth");
const { getTimeSheet } = require('../controller/timeSheetController');
const { timesheetPermission } = require('../middleware/permission');

// Get all time sheet Routes
timeSheetRouter.get('/', Auth,timesheetPermission, getTimeSheet)

module.exports = timeSheetRouter