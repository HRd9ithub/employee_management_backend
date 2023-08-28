const express = require("express")
const expressValidator = require("express-validator");
const Auth = require("../middleware/auth");
const { addEmergency } = require("../controller/emergencyController");
const multer = require("multer");
const path = require("path");
const imgConfig = require("../middleware/documentUpload");
const userDocumentRoute = express.Router();

const documentUpload = multer({
    storage: imgConfig,
    dest: 'uploads/',
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.svg' && ext !== '.jpeg' && ext !== '.pdf' && ext !== '.doc') {
            callback(null, false)
            return callback(new Error('The file is invalid or the image type is not allowed. Allowed types: SVG, jpeg, jpg, png, pdf, doc'))
        }
        callback(null, true)
    },
    onError: function (err, next) {
        console.log('error', err);
        next(err);
    }
}).fields([{ name: 'resume', maxCount: 1 },
{ name: 'offer_letter', maxCount: 8 }])

// account detail add api
// userDocumentRoute.post('/', Auth, [expressValidator.body('user_id', "User id is Required.").isMongoId()],[multer({
//     storage: imgConfig,
//     dest: 'uploads/',
//     fileFilter: function (req, file, callback) {
//         var ext = path.extname(file.originalname);
//         if (ext !== '.png' && ext !== '.jpg' && ext !== '.svg' && ext !== '.jpeg' && ext !== '.pdf' && ext !== '.doc') {
//             callback(null, false)
//             return callback(new Error('The file is invalid or the image type is not allowed. Allowed types: SVG, jpeg, jpg, png, pdf, doc'))
//         }
//         callback(null, true)
//     },
//     onError: function (err, next) {
//         console.log('error', err);
//         // next(err);
//     }
// }).fields([{ name: 'resume', maxCount: 1 },
// { name: 'offer_letter', maxCount: 8 }])], function (req, res) {
//     res.status(204).end();
// })


module.exports = userDocumentRoute