const { default: mongoose } = require("mongoose");
const user = require("../models/UserSchema")
const expressValidator = require("express-validator");
const bcrypt = require("bcryptjs");
const profile_image = require("../middleware/ImageProfile");
const loginInfo = require("../models/loginInfoSchema");

// create user function
const createUser = async (req, res) => {
    try {
        const errors = expressValidator.validationResult(req)

        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: err, success: false })
        }

        const userData = new user(req.body);
        const response = await userData.save();
        console.log('response', response)
        return res.status(201).json({ success: true, message: "User create successfully." })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// single user data fetch function
const activeUser = async (req, res) => {
    try {
        console.log('req.params', req.params, new mongoose.Types.ObjectId(req.params.id))
        const value = await user.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(req.params.id) }
            },
            {
                $lookup: {
                    from: "departments", localField: "department_id", foreignField: "_id", as: "department"
                }
            },
            {
                $lookup: {
                    from: "designations", localField: "designation_id", foreignField: "_id", as: "designation"
                }
            },
            {
                $lookup: {
                    from: "roles", localField: "role_id", foreignField: "_id", as: "role"
                }
            },
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
        return res.status(200).json({ success: true, message: "User data fetch successfully.", data: value[0] })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// all user data fetch function
const getUser = async (req, res) => {
    try {
        // if (req.user) {
        const value = await user.aggregate([
            {
                $lookup: {
                    from: "roles", localField: "role_id", foreignField: "_id", as: "role"
                }
            },
            { $unwind: { path: "$role" } },
            {
                $lookup: {
                    from: "users", localField: "report_by", foreignField: "_id", as: "report"
                }
            },
            { $unwind: { path: "$report" } },
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
                    // report: {$first: "$report" }
                    // role: {$arrayElemAt:["$role",0]},
                    "report.first_name": 1,
                    "report.last_name": 1,
                    "report._id": 1,
                    "report.profile_image": 1
                }
            }
        ])
        console.log('value', value)
        return res.status(200).json({ success: true, message: "User data fetch successfully.", data: value,permissions : req.permissions })
        // }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// update user data function
const updateUser = async (req, res) => {
    try {
        console.log('req.body', req.params)

        // check email exist or not
        const data = await user.findOne({ email: req.body.email })
        console.log(data, "====> email")

        if (data && data._id != req.params.id) {
            return res.status(400).json({ message: "email address already exists.", success: false })
        } else {
            profile_image(req, res, async function (err) {
                if (err) {
                    return res.status(400).send({ message: err.message })
                }

                // Everything went fine.
                let file = req.file;
                req.body.profile_image = req.file && req.file.filename
                // data update method
                const response = await user.findByIdAndUpdate({ _id: req.params.id }, req.body);
                console.log('response', response)

                if (response) {
                    return res.status(200).json({ success: true, message: "User update successfully." })
                } else {
                    return res.status(404).json({ success: false, message: "User not found." })
                }
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// delete user data function
const deleteUser = async (req, res) => {
    try {
        console.log('req.body', req.params)
        // check email exist or not
        const data = await user.findOne({ _id: req.params.id })
        console.log(data, "====> delete")

        if (!data) {
            return res.status(404).json({ message: "User are not found.", success: false })
        } else {
            // req.body.deleteAt = Date.now()
            // data update method
            const response = await user.findByIdAndUpdate({ _id: req.params.id }, { delete_at: Date.now() });
            console.log('response', response)
            return res.status(200).json({ success: true, message: "User delete successfully." })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// update user status function
const updateStatusUser = async (req, res) => {
    try {
        console.log('req.body', req.params)
        // check email exist or not
        const data = await user.findOne({ _id: req.params.id })
        console.log(data, "====> staus")

        if (!data) {
            return res.status(404).json({ message: "User are not found.", success: false })
        } else {
            // data update method
            const response = await user.findByIdAndUpdate({ _id: req.params.id }, { status: data.status === 'Active' ? 'Inactive' : "Active" });
            console.log('response', response)
            return res.status(200).json({ success: true, message: "User status update successfully." })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// check Email function
const checkEmail = async (req, res) => {
    try {
        const errors = expressValidator.validationResult(req)
        console.log('errors', errors)
        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: err, success: false })
        }

        // check email exist or not
        const data = await user.findOne({ email: { $regex: new RegExp('^' + req.body.email, 'i') } })
        console.log(data, "====> check email")

        if (data) {
            return res.status(400).json({ message: "Email address already exists.", success: false })
        } else {
            return res.status(200).json({ success: true, message: "Email address not exists." })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// check Email function
const checkEmployeeId = async (req, res) => {
    try {
        const errors = expressValidator.validationResult(req)
        console.log('errors', errors)
        let err = errors.array().map((val) => {
            return val.msg
        })

        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: err, success: false })
        }

        // check email exist or not
        const data = await user.findOne({ employee_id: { $regex: new RegExp('^' + req.body.employee_id, 'i') } })
        console.log(data, "====> check employee id")

        if (data) {
            return res.status(400).json({ message: "Employee id already exists.", success: false })
        } else {
            return res.status(200).json({ success: true, message: "Employee id not exists." })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// change profile image
const changeImage = async (req, res) => {
    console.log(req.file)
    profile_image(req, res, async function (err) {
        if (err) {
            return res.status(400).send({ message: err.message })
        }

        // Everything went fine.
        let file = req.file;

        try {
            if (req.file) {
                let data = await user.findByIdAndUpdate({ _id: req.user._id }, { profile_image: req.file.filename });
                return res.status(200).json({ message: "Profile changed successfully.", success: true })
            } else {
                return res.status(400).json({ message: "Profile Image is Required.", success: false })
            }
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: "Internal server error", success: false })
        }
    })
}

// change password
const changePassword = async (req, res) => {
    try {
        const errors = expressValidator.validationResult(req)
        console.log('errors', errors)
        let err = errors.array().map((val) => {
            return val.msg
        })

        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: err, success: false })
        }

        const userData = await user.findOne({ _id: req.user._id }).select("-token")

        // password compare
        let isMatch = await bcrypt.compare(req.body.current_password, userData.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Current Password is invalid.", success: false })
        }

        // password convert hash
        let passwordHash = await bcrypt.hash(req.body.new_password, 10)

        let updateData = await user.findByIdAndUpdate({ _id: userData._id }, { password: passwordHash, $unset: { token: 1 } })

        res.status(200).json({ message: "Your password has been changed successfully.", success: true })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}
// get login information
const getLoginInfo = async (req, res) => {
    try {
        console.log('req.params', req.body, new mongoose.Types.ObjectId(req.body.id))
        const value = await loginInfo.aggregate([
            {
                $match: { userId: new mongoose.Types.ObjectId(req.body.id) }
            },
            {
                $lookup: {
                    from: "timesheets", localField: "_id", foreignField: "login_id", as: "timesheet"
                }
            },
            {
                $lookup: {
                    from: "users", localField: "userId", foreignField: "_id", as: "user"
                }
            }, { $sort: { "createdAt": -1 } },
            {
                $project: {
                    "ip": 1,
                    "city": 1,
                    "device": 1,
                    "userId": 1,
                    "createdAt": 1,
                    "device_name": 1,
                    "browser_name": 1,
                    "timesheet.date": 1,
                    "timesheet.login_time": 1,
                    "timesheet.logout_time": 1,
                    "timesheet.total": 1,
                    "user.first_name": 1,
                    "user.last_name": 1,
                    "user.profile_image": 1,
                    "user.employee_id": 1,
                    "user.status": 1
                }
            }
        ])


        return res.status(200).json({ success: true, message: "User data fetch successfully.", data: value })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// get user name information
const getUserName = async (req, res) => {
    try {
        let date = new Date().toISOString()
        console.log('req.params', req.body, new mongoose.Types.ObjectId(req.body.id), date)
        const value = await user.aggregate([
            {
                $match: {
                    status: "Active", "delete_at": null
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
            return (!val.leaveing_date || val.leaveing_date && new Date(val.leaveing_date).toISOString() > date) && val.role.toLowerCase() !== "admin"
        })


        return res.status(200).json({ success: true, message: "User data fetch successfully.", data: data })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}


module.exports = { createUser, activeUser, getUser, getUserName, updateUser, deleteUser, updateStatusUser, checkEmail, getLoginInfo, checkEmployeeId, changeImage, changePassword }