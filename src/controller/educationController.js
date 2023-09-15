const expressValidator = require("express-validator");
const education = require("../models/educationSchema");

// create and edit education detail function
const addEditEduction = async (req, res) => {
    try {
        const errors = expressValidator.validationResult(req)

        let err = errors.array().map((val) => {
            return val.msg
        })

        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: [...new Set(err)], success: false })
        }

        // check data exist or not
        const data = await education.findOne({ user_id: req.body.user_id })

        if (data) {
            let response = await education.deleteMany({ user_id: req.body.user_id });
        }
        for (const key in req.body.info) {
            const educationData = new education({
                user_id: req.body.user_id,
                year: req.body.info[key].year,
                percentage: req.body.info[key].percentage,
                university_name: req.body.info[key].university_name,
                degree: req.body.info[key].degree
            });
            const response = await educationData.save();
        }
        return res.status(200).json({ success: true, message: "Saved Successfully." })
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error", success: false })
    }
}

// delete education detail function
const deleteEducation = async (req, res) => {
    try {
        const errors = expressValidator.validationResult(req)

        let err = errors.array().map((val) => {
            return val.msg
        })

        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: [...new Set(err)], success: false })
        }

        let response = await education.findByIdAndDelete(
            { '_id': req.params.id });

        if (response) {
            return res.status(200).json({ success: true, message: "Deleted Successfully." })
        } else {
            return res.status(400).json({ success: false, message: "Record Not found." })
        }

    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error", success: false })
    }
}



module.exports = { addEditEduction, deleteEducation }