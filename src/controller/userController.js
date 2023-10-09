const { default: mongoose } = require("mongoose");
const user = require("../models/UserSchema")
const expressValidator = require("express-validator");
const bcrypt = require("bcryptjs");
const profile_image = require("../middleware/ImageProfile");
const loginInfo = require("../models/loginInfoSchema");
const path = require("path");
const role = require("../models/roleSchema");
const designation = require("../models/designationSchema");
const moment = require("moment");

// create user function
const createUser = async (req, res) => {
    try {
        const errors = expressValidator.validationResult(req)

        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: err, success: false })
        }

        let error = []
        // role id check 
        let roles = await role.findOne({ _id: req.body.role_id })
        if (!roles) { error.push("Role id is not exists.") }

        // designation id check
        let designations = await designation.findOne({ _id: req.body.designation_id })
        if (!designations) { error.push("Designation id is not exists.") }

        // report by id check
        let report = await user.findOne({ _id: req.body.report_by })
        if (!report) { error.push("report by id is not exists.") }

        if (error.length !== 0) return res.status(422).json({ error: error, success: false })

        const userData = new user(req.body);
        const response = await userData.save();
        return res.status(201).json({ success: true, message: "Data added successfully." })
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// single user data fetch function
const activeUser = async (req, res) => {
    try {
        const value = await user.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(req.params.id) }
            },
            {
                $lookup: {
                    from: "designations", localField: "designation_id", foreignField: "_id", as: "designation"
                }
            },
            { $unwind: { path: "$designation", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "roles", localField: "role_id", foreignField: "_id", as: "role"
                }
            },
            { $unwind: { path: "$role", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "users", localField: "report_by", foreignField: "_id", as: "report"
                }
            },
            {
                $lookup: {
                    from: "accounts", localField: "_id", foreignField: "user_id", as: "account_detail"
                }
            },
            {
                $lookup: {
                    from: "emergency_contacts", localField: "_id", foreignField: "user_id", as: "emergency_contact"
                }
            },
            {
                $lookup: {
                    from: "user_documents", localField: "_id", foreignField: "user_id", as: "user_document"
                }
            }, {
                $lookup: {
                    from: "educations", localField: "_id", foreignField: "user_id", as: "education"
                }
            },
            {
                $project: {
                    "password": 0,
                    "token": 0,
                    "expireIn": 0,
                    "otp": 0,
                    "role.permissions": 0,
                    "report.password": 0,
                    "report.token": 0,
                    "report.expireIn": 0,
                    "report.otp": 0,
                }
            }
        ])

        return res.status(200).json({ success: true, message: "User data fetch successfully.", data: value[0], permissions: req.permissions })

    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// all user data fetch function
const getUser = async (req, res) => {
    try {
        // if (req.user) {
        const value = await user.aggregate([
            {
                $match: {
                    "delete_at": { $exists: false },
                    $or: [
                        { "leaveing_date": { $eq: null } },
                        { "leaveing_date": { $gt: new Date(moment(new Date()).format("YYYY-MM-DD")) } },
                    ]
                }
            },
            {
                $lookup: {
                    from: "roles", localField: "role_id", foreignField: "_id", as: "role"
                }
            },
            { $unwind: { path: "$role", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "users", localField: "report_by", foreignField: "_id", as: "report"
                }
            },
            { $unwind: { path: "$report", preserveNullAndEmptyArrays: true } },
            {
                $match: {
                    "report.delete_at": { $exists: false },
                    $or: [
                        { "report.leaveing_date": { $eq: null } },
                        { "report.leaveing_date": { $gt: new Date(moment(new Date()).format("YYYY-MM-DD")) } },
                    ]
                }
            },
            {
                $project: {
                    "employee_id": 1,
                    "profile_image": 1,
                    "first_name": 1,
                    "last_name": 1,
                    "email": 1,
                    "phone": 1,
                    "status": 1,
                    "role.name": 1,
                    "leaveing_date": 1,
                    "report.first_name": 1,
                    "report.last_name": 1,
                    "report.status": 1,
                    "report._id": 1,
                    "report.profile_image": 1
                }
            }
        ])

        let data = value.filter((val) => {
            return !val.leaveing_date || moment(val.leaveing_date).format("YYYY-MM-DD") > moment(new Date()).format("YYYY-MM-DD")
        })
        return res.status(200).json({ success: true, message: "User data fetch successfully.", data: data, permissions: req.permissions })
        // }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// update user data function
const updateUser = async (req, res) => {
    try {
        // check email exist or not
        const data = await user.findOne({ email: req.body.email })

        if (data && data._id != req.params.id) {
            return res.status(422).json({ message: "email address already exists.", success: false })
        } else {
            profile_image(req, res, async function (err) {
                if (err) {
                    return res.status(422).send({ message: err.message })
                }

                // Everything went fine.
                let file = req.file;
                req.body.profile_image = req.file && req.file.filename
                // data update method
                const response = await user.findByIdAndUpdate({ _id: req.params.id }, req.body);

                if (response) {
                    return res.status(200).json({ success: true, message: "Data updated successfully." })
                } else {
                    return res.status(404).json({ success: false, message: "User not found." })
                }
            })
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// delete user data function
const deleteUser = async (req, res) => {
    try {
        // check email exist or not
        const data = await user.findOne({ _id: req.params.id })

        if (!data) {
            return res.status(404).json({ message: "User are not found.", success: false })
        } else {
            // req.body.deleteAt = Date.now()
            // data update method
            const response = await user.findByIdAndUpdate({ _id: req.params.id }, { delete_at: Date.now() });
            return res.status(200).json({ success: true, message: "Data deleted successfully." })
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// update user status function
const updateStatusUser = async (req, res) => {
    try {
        // check email exist or not
        const data = await user.findOne({ _id: req.params.id })

        if (!data) {
            return res.status(404).json({ message: "User are not found.", success: false })
        } else {
            // data update method
            const response = await user.findByIdAndUpdate({ _id: req.params.id }, { status: data.status === 'Active' ? 'Inactive' : "Active" });
            return res.status(200).json({ success: true, message: "Status updated successfully." })
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// check Email function
const checkEmail = async (req, res) => {
    try {
        const errors = expressValidator.validationResult(req)
        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: err[0], success: false })
        }

        // check email exist or not
        const data = await user.findOne({ email: req.body.email })
        if (data) {
            return res.status(400).json({ error: "Email address already exists.", success: false })
        } else {
            return res.status(200).json({ success: true, message: "Email address not exists." })
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// check Email function
const checkEmployeeId = async (req, res) => {
    try {
        const errors = expressValidator.validationResult(req)
        let err = errors.array().map((val) => {
            return val.msg
        })

        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: err[0], success: false })
        }

        // check email exist or not
        const data = await user.findOne({ employee_id: { $regex: new RegExp('^' + req.body.employee_id, 'i') } })

        if (data) {
            return res.status(400).json({ error: "Employee id already exists.", success: false })
        } else {
            return res.status(200).json({ success: true, message: "Employee id not exists." })
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// change profile image
const changeImage = async (req, res) => {
    profile_image(req, res, async function (err) {
        if (err) {
            return res.status(400).send({ message: err.message })
        }

        // Everything went fine.
        let file = req.file;

        try {
            if (req.file) {
                let data = await user.findByIdAndUpdate({ _id: req.user._id }, { profile_image: `uploads/${req.file.filename}` });
                return res.status(200).json({ message: "Profile image updated successfully.", success: true })
            } else {
                return res.status(400).json({ message: "Profile Image is Required.", success: false })
            }
        } catch (error) {
            res.status(500).json({ message: error.message || 'Internal server Error', success: false })
        }
    })
}

// change password
const changePassword = async (req, res) => {
    try {
        const errors = expressValidator.validationResult(req)
        let err = errors.array().map((val) => {
            return val.msg
        })

        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: err, success: false })
        }

        const userData = await user.findOne({ _id: req.user._id }).select("-token")

        // password compare
        let isMatch = await bcrypt.compare(req.body.current_password, userData.password);

        if (!isMatch) {
            return res.status(400).json({ error: ["Incorrect current password."], success: false })
        }

        // password convert hash
        let passwordHash = await bcrypt.hash(req.body.new_password, 10)

        let updateData = await user.findByIdAndUpdate({ _id: userData._id }, { password: passwordHash })

        res.status(200).json({ message: "Password updated successfully.", success: true })
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}
// get login information
const getLoginInfo = async (req, res) => {
    try {
        let { id, startDate, endDate } = req.body

        const errors = expressValidator.validationResult(req)
        let err = errors.array().map((val) => {
            return val.msg
        })

        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: err, success: false })
        }
        // const value = await loginInfo.aggregate([
        //     {
        //         $match: { userId: new mongoose.Types.ObjectId(req.body.id) }
        //     },
        //     {
        //         $lookup: {
        //             from: "timesheets", localField: "_id", foreignField: "login_id", as: "timesheet"
        //         }
        //     },
        //     {
        //         $unwind:
        //         {
        //             path: "$timesheet",
        //             preserveNullAndEmptyArrays: true
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "users", localField: "userId", foreignField: "_id", as: "user"
        //         }
        //     }, { $sort: { "createdAt": -1 } },
        //     {
        //         $project: {
        //             "ip": 1,
        //             "city": 1,
        //             "device": 1,
        //             "userId": 1,
        //             "createdAt": 1,
        //             "device_name": 1,
        //             "browser_name": 1,
        //             "timesheet.date": 1,
        //             "timesheet.login_time": 1,
        //             "timesheet.logout_time": 1,
        //             "timesheet.total": 1,
        //             "user.first_name": 1,
        //             "user.last_name": 1,
        //             "user.profile_image": 1,
        //             "user.employee_id": 1,
        //             "user.status": 1
        //         }
        //     }
        // ])

        let value = await loginInfo.find({
            $and: [
                { userId: { $eq: id } },
                { $and: [{ createdAt: { $gte: startDate } }, { createdAt: { $lte: endDate } }] },
            ]
        }).sort({ createdAt: -1 })


        return res.status(200).json({ success: true, message: "User login info data fetch successfully.", data: value })

    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// get user name information
const getUserName = async (req, res) => {
    try {
        let date = new Date().toISOString()
        const value = await user.aggregate([
            {
                $match: {
                    // status: "Active",
                    delete_at: { $exists: false },
                    joining_date: { "$lte": new Date(moment(new Date()).format("YYYY-MM-DD")) },
                    $or: [
                        { leaveing_date: { $eq: null } },
                        { leaveing_date: { $gt: new Date(moment(new Date()).format("YYYY-MM-DD")) } },
                    ]
                }
            },
            {
                $lookup: {
                    from: "roles", localField: "role_id", foreignField: "_id", as: "role"
                }
            },
            {
                $project: {
                    "first_name": 1,
                    "last_name": 1,
                    role: { $first: "$role.name" },
                    leaveing_date: 1
                }
            }
        ])

        let data = value.filter((val) => {
            return (!val.leaveing_date || val.leaveing_date && new Date(val.leaveing_date).toISOString() > date)
        })


        return res.status(200).json({ success: true, message: "User data fetch successfully.", data: data })

    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}


module.exports = { createUser, activeUser, getUser, getUserName, updateUser, deleteUser, updateStatusUser, checkEmail, getLoginInfo, checkEmployeeId, changeImage, changePassword }