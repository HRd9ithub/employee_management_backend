const { Router } = require("express");
const { addLogin, addLogout, getAttendance } = require("../controller/attendanceController");
const { check } = require("express-validator");
const Auth = require("../middleware/auth");
const { attendancePermission } = require("../middleware/permission");

const route = Router();

// validation part
const addvalidation = [
    check("login_time", "Log in time is required.").notEmpty()
]
// validation part
const updatevalidation = [
    check("login_time", "Log in time is required.").notEmpty(),
    check("logout_time", "Log in time is required.").notEmpty(),
]


route.post("/",Auth,attendancePermission,addvalidation, addLogin);

route.put("/:id",Auth,attendancePermission,updatevalidation, addLogout);

route.get("/", Auth,attendancePermission,getAttendance);


module.exports = route;