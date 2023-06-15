const express = require("express")
const Auth = require("../middleware/auth");
const { createDesignation, updateDesignation,deleteDesignation,getDesignation} = require("../controller/designationController");

const designationRoute = express.Router();

// create department api
designationRoute.post('/',Auth,createDesignation);

// update department api
designationRoute.patch('/:id',Auth,updateDesignation);

// delete department api
designationRoute.delete('/:id',Auth,deleteDesignation);

// get department api
designationRoute.get('/',Auth,getDesignation);


module.exports = designationRoute