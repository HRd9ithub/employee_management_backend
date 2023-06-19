const express = require("express");
const Auth = require("../middleware/auth");
const { body } = require("express-validator");
const { addDocument, getDocument, updateDocument, deleteDocument } = require("../controller/documentController");
const documentRoute = express.Router();


// add document api
documentRoute.post('/', Auth, [body("name", "name is required.").notEmpty(),
body("description", "description is required.").notEmpty()
],addDocument)


// update document api
documentRoute.put('/:id', Auth, [body("name", "name is required.").notEmpty(),
body("description", "description is required.").notEmpty()
],updateDocument)

// get api
documentRoute.get('/',Auth,getDocument)

// delete api
documentRoute.delete('/:id',Auth,deleteDocument)


module.exports = documentRoute