const express = require("express")
const Auth = require("../middleware/auth");
const expressValidator = require("express-validator");
const { createDesignation, updateDesignation,deleteDesignation,getDesignation, checkDesignation} = require("../controller/designationController");
const { designationtPermission } = require("../middleware/permission");

const designationRoute = express.Router();

// create Designation api
designationRoute.post('/',Auth,designationtPermission,[expressValidator.body("name","Designation name is Required.").notEmpty()],createDesignation);

// update Designation api
designationRoute.patch('/:id',Auth,designationtPermission,[expressValidator.body("name","Designation name is Required.").notEmpty()],updateDesignation);

// delete Designation api
designationRoute.delete('/:id',Auth,designationtPermission,deleteDesignation);

// get Designation api
designationRoute.get('/',Auth,designationtPermission,getDesignation);

// check designation
designationRoute.post('/name', Auth, [expressValidator.body("name","Designation name is Required.").notEmpty()],checkDesignation)


module.exports = designationRoute