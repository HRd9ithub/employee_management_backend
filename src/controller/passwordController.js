const expressValidator = require("express-validator");
const PasswordSchema = require("../models/passwordSchema");
const { default: mongoose } = require("mongoose");
const encryptData = require("../helper/encrptData");
const decryptData = require("../helper/decryptData");

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

        // encrypt data 
        let user_name = encryptData(req.body.user_name)
        let password = encryptData(req.body.password)
        let title = encryptData(req.body.title)
        let url = encryptData(req.body.url)
        let note = encryptData(req.body.note)

        let passwordData = new PasswordSchema({
            title: title,
            url: url,
            note: note,
            user_name: user_name,
            password: password,
            access_employee: req.body.access_employee
        });
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
            return res.status(404).json({ success: false, message: "Record Not Found." })
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
            return res.status(404).json({ success: false, message: "Record Not Found." })
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
                        "note": 1,
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
                        "note": 1,
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

        let decryptPassword = passwords.map((item) => {
            return {
                _id: item._id,
                title:decryptData(item.title),
                url:decryptData(item.url),
                user_name: decryptData(item.user_name),
                password: decryptData(item.password),
                note:decryptData(item.note),
                access_employee: item.access_employee,
                createdAt: item.createdAt,
                updatedAt: item.updatedAt,
                access: item.access
            }
        })

        return res.status(200).json({ success: true, data: decryptPassword, permissions: permission })
    } catch (err) {
        res.status(500).json({ message: err.message || 'Internal Server Error', success: false })
    }
}

module.exports = { createPassword, getPassword, updatePassword, deletePassword }