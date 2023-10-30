const expressValidator = require("express-validator");
const PasswordSchema = require("../models/passwordSchema");
const { default: mongoose } = require("mongoose");

// create password function
const createPassword = async (req, res) => {
    try {
        const errors = expressValidator.validationResult(req)

        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: err, success: false })
        }

        let passwordData = new PasswordSchema(req.body);
        let response = await passwordData.save();

        return res.status(201).json({ success: true, message: "Data added successfully." })

    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// update password function
const updatePassword = async (req, res) => {
    try {
        let { id } = req.params;
        const errors = expressValidator.validationResult(req);

        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: err, success: false })
        }

        let response = await PasswordSchema.findByIdAndUpdate({ _id: id }, { $set: req.body });
        if (response) {
            return res.status(200).json({ success: true, message: "Data updated successfully." })
        } else {
            return res.status(400).json({ success: false, message: "Record Not Found." })
        }

    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// delete password function
const deletePassword = async (req, res) => {
    try {
        let { id } = req.params;

        let response = await PasswordSchema.findByIdAndUpdate({ _id: id }, { $set: { isDelete: true } });
        if (response) {
            return res.status(200).json({ success: true, message: "Data deleted successfully." })
        } else {
            return res.status(400).json({ success: false, message: "Record Not Found." })
        }

    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// get password function
const getPassword = async (req, res) => {
    try {
        let permission = req.permissions;
        let passwords = [];
        let { _id } = req.user;

        if (permission.name.toLowerCase() !== "admin") {
            passwords = await PasswordSchema.aggregate([
                {
                    $match: {
                        isDelete: false,
                        access_employee: new mongoose.Types.ObjectId(_id)
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "access_employee",
                        foreignField: "_id",
                        as: "access"
                    }
                },
                {
                    $project: {
                        "title": 1,
                        "url": 1,
                        "user_name": 1,
                        "password": 1,
                        "access_employee": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "access._id": 1,
                        "access.first_name": 1,
                        "access.last_name": 1,
                    }
                }
            ])
        } else {
            passwords = await PasswordSchema.aggregate([
                { $match: { isDelete: false } },
                {
                    $lookup: {
                        from: "users",
                        localField: "access_employee",
                        foreignField: "_id",
                        as: "access"
                    }
                },
                {
                    $project: {
                        "title": 1,
                        "url": 1,
                        "user_name": 1,
                        "password": 1,
                        "access_employee": 1,
                        "createdAt": 1,
                        "updatedAt": 1,
                        "access._id": 1,
                        "access.first_name": 1,
                        "access.last_name": 1,
                    }
                }
            ])
        }

        return res.status(200).json({ success: true, data: passwords, permissions: permission })
    } catch (err) {
        res.status(500).json({ message: err.message || 'Internal Server Error', success: false })
    }
}

module.exports = { createPassword, getPassword, updatePassword, deletePassword }