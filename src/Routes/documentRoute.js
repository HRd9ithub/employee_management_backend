const express = require("express");
const Auth = require("../middleware/auth");
const { body } = require("express-validator");
const { addDocument, getDocument, updateDocument, deleteDocument } = require("../controller/documentController");
const { documentPermission } = require("../middleware/permission");
const documentRoute = express.Router();


// add document api
documentRoute.post('/',Auth,documentPermission,[body('name', "File name field is Required.").notEmpty(),
body('description', "File name field is Required.").notEmpty()
], addDocument)


// update document api
documentRoute.put('/:id', Auth,documentPermission, [body("name", "name is required.").notEmpty(),
body("description", "description is required.").notEmpty()
],updateDocument)

// get api
documentRoute.get('/',Auth,documentPermission,getDocument)

// delete api
documentRoute.delete('/:id',Auth,documentPermission,deleteDocument)


module.exports = documentRoute