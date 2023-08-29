const expressValidator = require("express-validator");
const emergency_contact = require("../models/emergencySchema");

// create emergency detail function
const addEmergency = async (req, res) => {
    try {
        console.log('req.body', req.body)
        const errors = expressValidator.validationResult(req)

        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: err, success: false })
        }

        console.log(req.user)

        // check data exist or not
        const data = await emergency_contact.findOne({ user_id: req.body.user_id })
        console.log(data, "====> email")

        if (data) {
            let response = await emergency_contact.findByIdAndUpdate({ _id: data._id }, req.body);
            if (response) {
                return res.status(200).json({ success: true, message: "Saved Successfully." })
            } else {
                return res.status(400).json({ success: false, message: "Record Not found." })
            }
        } else {
            const emergency_contactData = new emergency_contact(req.body);
            const response = await emergency_contactData.save();
            console.log('response', response)
            return res.status(201).json({ success: true, message: "Added Successfully." })
        }
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

module.exports = { addEmergency }