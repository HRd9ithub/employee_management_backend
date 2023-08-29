const express = require("express")
const Auth = require("../middleware/auth");
const expressValidator = require("express-validator");
const { createDesignation, updateDesignation,deleteDesignation,getDesignation, checkDesignation} = require("../controller/designationController");

const designationRoute = express.Router();

// create Designation api
designationRoute.post('/',Auth,[expressValidator.body("name","Designation name is Required.").notEmpty()],createDesignation);

// update Designation api
designationRoute.patch('/:id',Auth,[expressValidator.body("name","Designation name is Required.").notEmpty()],updateDesignation);

// delete Designation api
designationRoute.delete('/:id',Auth,deleteDesignation);

// get Designation api
designationRoute.get('/',Auth,getDesignation);

// check designation
designationRoute.post('/name', Auth, [expressValidator.body("name","Designation name is Required.").notEmpty()],checkDesignation)


module.exports = designationRoute