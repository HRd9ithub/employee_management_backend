const express = require("express");
const { body } = require("express-validator");
const { addLoginTime, addLogoutTime, getTimeSheet, getSingleData } = require("../controller/timeSheetController");
const Auth = require("../middleware/auth");

const timeSheetRoute = new express.Router();

// add login time api
timeSheetRoute.post("/",Auth,[body("login_time","login time is required.").notEmpty()],addLoginTime);

// add logout time api
timeSheetRoute.patch("/",Auth,[body("logout_time","logout time is required.").notEmpty()],addLogoutTime);

// get all data api
timeSheetRoute.get("/",Auth,getTimeSheet);

// get single data api
timeSheetRoute.get("/single",Auth,getSingleData);



module.exports = timeSheetRoute