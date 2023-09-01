const express = require("express")
const Auth = require("../middleware/auth");
const expressValidator = require("express-validator");
const { createHoliday, getHoliday, deleteHoliday,updateHoliday } = require("../controller/holidayController");

const holidayRoute = express.Router();

// create Holiday api
holidayRoute.post('/', Auth,
[expressValidator.body('date', "Invalid Date format.Please enter the date in the format 'DD-MM-YYYY'.").isDate({ format: 'DD-MM-YYYY' }),
 expressValidator.body("name","Holiday name is Required.").notEmpty(),
 expressValidator.body("day","Day is Required.").notEmpty()
],createHoliday);

// update Holiday api
holidayRoute.put('/:id', Auth,
[expressValidator.body('date', "Invalid Date format.Please enter the date in the format 'DD-MM-YYYY'.").isDate({ format: 'DD-MM-YYYY' }),
 expressValidator.body("name","Holiday name is Required.").notEmpty(),
 expressValidator.body("day","Day is Required.").notEmpty()
],updateHoliday);

// delete Holiday api
holidayRoute.delete('/:id',Auth,deleteHoliday);

// get Holiday api
holidayRoute.get('/',Auth,getHoliday);


module.exports = holidayRoute;