const express = require("express");
const Auth = require("../middleware/auth");
const { body } = require("express-validator");
const { addRole, singleRole, checkRole, updateRole, getRole } = require("../controller/roleController");
const role = require("../models/roleSchema");
const { rolePermission } = require("../middleware/permission");
const roleRoute = express.Router();

// single data
roleRoute.get('/:id',Auth,singleRole)

// add document api
roleRoute.post('/', Auth,rolePermission, [body("name", "User role is required.").notEmpty().custom(async (email, { req }) => {
    const data = await role.findOne({ name: { $regex: new RegExp('^' + req.body.name, 'i') } })
   
    if(data){
        throw new Error("User Role Already Exist.")
    }
}),
body("permissions", "Permissions is required.").isArray()
],addRole)

// check user role 
roleRoute.post('/name', Auth, [body("name", "User role is required.").notEmpty()],checkRole)

// update document api
roleRoute.put('/:id', Auth,rolePermission,[body("name", "User role is required.").notEmpty().custom(async (email, { req }) => {
    const data = await role.findOne({ name: { $regex: new RegExp('^' + req.body.name, 'i') } })
    if(data && data._id !=  req.params.id){
        throw new Error("User Role Already Exist.")
    }
}),
body("permissions", "Permissions is required.").notEmpty()
],updateRole)

// get api

roleRoute.get('/',Auth,rolePermission,getRole)

module.exports = roleRoute