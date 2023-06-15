const express = require("express")
const Auth = require("../middleware/auth");
const { createHoliday, getHoliday, deleteHoliday,updateHoliday } = require("../controller/holidayController");

const holidayRoute = express.Router();

// create Holiday api
holidayRoute.post('/', Auth, createHoliday);

// update Holiday api
holidayRoute.put('/:id',Auth,updateHoliday);

// delete Holiday api
holidayRoute.delete('/:id',Auth,deleteHoliday);

// get Holiday api
holidayRoute.get('/',Auth,getHoliday);


module.exports = holidayRoute;