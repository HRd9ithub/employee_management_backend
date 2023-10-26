let express = require("express");
let activityRoute = express.Router();
const getActivity = require("../controller/activityController");
const Auth = require("../middleware/auth");
const { activityPermission } = require("../middleware/permission");


// get data for route
activityRoute.get("/",Auth, activityPermission, getActivity);


module.exports = activityRoute;