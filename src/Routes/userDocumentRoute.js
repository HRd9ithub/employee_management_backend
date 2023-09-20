const express = require("express")
const expressValidator = require("express-validator");
const Auth = require("../middleware/auth");
const {uploadSingleImage} = require("../middleware/documentUpload");
const user_document = require("../models/userDocumentSchema");
const userDocumentRoute = express.Router();


userDocumentRoute.post('/',Auth, function (req, res) {
    const errors = expressValidator.validationResult(req)

    let err = errors.array().map((val) => {
        return val.msg
    })
    // check data validation error
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: err, success: false })
    }

    uploadSingleImage(req, res, async function (err) {
        if (err) {
            return res.status(400).send({ message: err.message })
        }

        // Everything went fine.
        const file = req.files;

        let resume = file && file.resume && file.resume[0].filename
        let offer_letter = file && file.offer_letter && file.offer_letter[0].filename
        let joining_letter = file && file.joining_letter && file.joining_letter[0].filename
        let other = file && file.other && file.other[0].filename

        try {
             // check data exist or not
        const data = await user_document.findOne({ user_id: req.body.user_id })

        if (data) {
            let response = await user_document.findByIdAndUpdate({ _id: data._id }, {resume,joining_letter,offer_letter,other});
            if (response) {
                return res.status(200).json({ success: true, message: "Saved Successfully." })
            } else {
                return res.status(404).json({ success: false, message: "Record Not found." })
            }
        } else {
            const documentData = new user_document({resume,joining_letter,offer_letter,other,user_id: req.body.user_id});
            const response = await documentData.save();
            return res.status(201).json({ success: true, message: "Added Successfully." })
        }
        } catch (error) {
            res.status(500).json({ message: error.message || "Internal server error", success: false })
        }
    })
})


module.exports = userDocumentRoute