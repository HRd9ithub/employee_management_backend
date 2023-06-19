const express = require("express");
const Auth = require("../middleware/auth");
const { body } = require("express-validator");
const { addDocument, getDocument, updateDocument, deleteDocument } = require("../controller/documentController");
const { addRole } = require("../controller/roleController");
const roleRoute = express.Router();


// add document api
roleRoute.post('/', Auth, [body("name", "name is required.").notEmpty(),
body("permission", "permission is required.").notEmpty()
],addRole)


// update document api
roleRoute.put('/:id', Auth, [body("name", "name is required.").notEmpty(),
body("description", "description is required.").notEmpty()
],updateDocument)

// get api
roleRoute.get('/',Auth,getDocument)

// delete api
roleRoute.delete('/:id',Auth,deleteDocument)


module.exports = roleRoute