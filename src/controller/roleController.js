const { validationResult } = require('express-validator');
const role = require('../models/roleSchema');
const menu = require('../models/menuSchema');
const { default: mongoose } = require('mongoose');

// add role function
const addRole = async (req, res) => {
    try {
        // check error or not
        const errors = validationResult(req)

        let err = errors.array().map((val) => {
            return val.msg
        })

        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: err, success: false })
        }

        const roleData = new role(req.body);

        const response = await roleData.save();

        return res.status(200).json({ success: true, message: "Successfully added a new role." })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// update document
const updateRole = async (req, res) => {
    try {
        // check error or not
        const errors = validationResult(req)

        let err = errors.array().map((val) => {
            return val.msg
        })

        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: err, success: false })
        }

        const response = await role.findByIdAndUpdate({ _id: req.params.id }, req.body)

        if (response) {
            return res.status(200).json({ success: true, message: "successfully edited user role." })
        } else {
            return res.status(404).json({ success: false, message: "Record is not found." })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// delete document
// const deleteDocument = async (req, res) => {
//     try {
//         const response = await document.findByIdAndDelete({ _id: req.params.id }, req.body)

//         if (response) {
//             return res.status(200).json({ success: true, message: "successfully deleted a document." })
//         } else {
//             return res.status(404).json({ success: false, message: "Document not found." })
//         }

//     } catch (error) {
//         console.log('error', error)
//         res.status(500).json({ message: "Internal server error", success: false })
//     }
// }

// get function
const getRole = async (req, res) => {
    try {
        const response = await role.find().select("-permissions");

        return res.status(200).json({ success: true, message: "successfully fetch for user role.", data: response, permissions: req.permissions })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// get single function
const singleRole = async (req, res) => {
    try {
        if (req.params.id !== "static") {
            // const response = await role.findOne({ _id: req.params.id });

            let response = await role.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
                {$unwind : "$permissions"},
                {
                    $lookup: {
                        "from": "menus",
                        "localField": "permissions.menuId",
                        "foreignField": "_id",
                        "as": "permissions.data"
                    }
                },{
                    $project : {
                        name : 1,
                        "permissions.menuId" :1,
                        "permissions.list" :1,
                        "permissions.create" :1,
                        "permissions.update" :1,
                        "permissions.delete" :1,
                        "permissions._id" :1,
                        "permissions.name" :{$first : "$permissions.data.name" },
                    }
                },
                {$sort: {"permissions.menuId": 1}},
            ])

            return res.status(200).json({ success: true, message: "successfully fetch for user role.", data: response })
        } else {
            const response = await menu.find();

            let data = response.map((val) => {
                return { menuId: val._id, list: 0, create: 0, delete: 0, update: 0, name: val.name }
            })
            return res.status(200).json({ success: true, message: "successfully fetch for user role.", data: data })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// check user role existing function
const checkRole = async (req, res) => {
    try {
        const errors = validationResult(req)
        console.log('errors', errors)
        let err = errors.array().map((val) => {
            return val.msg
        })

        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: err, success: false })
        }

        const response = await role.findOne({ name: { $regex: new RegExp('^' + req.body.name, 'i') } });

        if (response) {
            return res.status(400).json({ success: false, message: "User Role Already Exist." })
        }
        return res.status(200).json({ success: true, message: "User Role not exist" })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

module.exports = { addRole, getRole, updateRole, singleRole, checkRole }