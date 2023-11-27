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
const clockOutvalidation = [
    check("clock_out", "clock out time is required.").notEmpty(),
]
const regulationValidation = [
    // check("clockIn", "Clock in time is required field.").notEmpty(),
    // check("clockOut", "Clock out time is required field.").notEmpty(),
    check("explanation", "Explanation is required field.").notEmpty(),
    check("timestamp", "Timestamp is required field.").notEmpty(),
    check("userId", "User id is required field.").isMongoId(),
    check("id", "ID is required field.").isMongoId(),
]


route.post("/",Auth,attendancePermission,clockInvalidation, clockIn);

route.put("/:id",Auth,attendancePermission,clockOutvalidation, clockOut);

route.get("/", Auth,attendancePermission,getAttendance);

// regulation email send route
route.post("/regulation", Auth,regulationValidation, sendRegulationMail);


module.exports = route;