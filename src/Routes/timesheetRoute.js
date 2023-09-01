const { Router } = require('express');
const timeSheetRouter = Router(); 
const Auth = require("../middleware/auth");
const { getTimeSheet } = require('../controller/timeSheetController');

// Get all time sheet Routes
timeSheetRouter.get('/', Auth, getTimeSheet)

module.exports = timeSheetRouter