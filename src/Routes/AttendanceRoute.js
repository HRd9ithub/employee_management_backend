const { Router } = require("express");
const { getAttendance, clockIn, clockOut, sendRegulationMail } = require("../controller/attendanceController");
const { check } = require("express-validator");
const Auth = require("../middleware/auth");
const { attendancePermission } = require("../middleware/permission");

const route = Router();

// validation part
const clockInvalidation = [
    check("clock_in", "clock in time is required.").notEmpty()
]
// validation part
const clockOutvalidation = [
    check("clock_out", "clock out time is required.").notEmpty(),
]


route.post("/",Auth,attendancePermission,clockInvalidation, clockIn);

route.put("/:id",Auth,attendancePermission,clockOutvalidation, clockOut);

route.get("/", Auth,attendancePermission,getAttendance);

// regulation email send route
route.post("/regulation", Auth, sendRegulationMail);


module.exports = route;