const expressValidator = require("express-validator");
const account = require("../models/accountSchema");

// create ACCOUNT detail function
const addAccount = async (req, res) => {
    try {
        const errors = expressValidator.validationResult(req)

        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: err, success: false })
        }

        // check data exist or not
        const data = await account.findOne({ user_id: req.body.user_id })

        if (data) {
            let response = await account.findByIdAndUpdate({ _id: data._id }, req.body);
            if (response) {
                return res.status(200).json({ success: true, message: "Data updated Successfully." })
            } else {
                return res.status(400).json({ success: false, message: "Record Not found." })
            }
        } else {
            const accountData = new account(req.body);
            const response = await accountData.save();
            return res.status(201).json({ success: true, message: "Data added Successfully." })
        }
    } catch (error) {
        res.status(500).json({ message: error.message || "Internal server error", success: false })
    }
}

module.exports = { addAccount }