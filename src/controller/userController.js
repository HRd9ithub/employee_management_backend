const { default: mongoose } = require("mongoose");
const upload = require("../middleware/ImageProfile");
const user = require("../models/UserSchema")
const expressValidator = require("express-validator");
const bcrypt = require("bcryptjs");
const account = require("../models/accountSchema");

// create user function
const createUser = async (req, res) => {
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

        const userData = new user(req.body);
        const response = await userData.save();
        console.log('response', response)
        return res.status(201).json({ success: true, message: "user create successfully." })
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: "Internal server error", success: false })
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
            }, {
                $lookup: {
                    from: "designations", localField: "designation_id", foreignField: "_id", as: "designation"
                }
            }, {
                $lookup: {
                    from: "roles", localField: "role_id", foreignField: "_id", as: "role"
                }
            },{
                $lookup: {
                    from: "users", localField: "reportTo", foreignField: "_id", as: "report"
                }
            }, {
                $lookup: {
                    from: "accounts", localField: "_id", foreignField: "user_id", as: "account_detail"
                }
            }, {
                $lookup: {
                    from: "emergency_contacts", localField: "_id", foreignField: "user_id", as: "emergency_contact"
                }
            },{
                $project: {
                    "password": 0,
                    "token": 0
                }
            }
        ])


        return res.status(200).json({ success: true, message: "User data fetch successfully.", data: value })

    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

// all user data fetch function
const getUser = async (req, res) => {
    try {
        // if (req.user) {
        const value = await user.aggregate([
            {
                $lookup: {
                    from: "departments", localField: "departmentId", foreignField: "_id", as: "department"
                }
            }, {
                $lookup: {
                    from: "designations", localField: "designationId", foreignField: "_id", as: "designation"
                }
            }, {
                $lookup: {
                    from: "users", localField: "reportTo", foreignField: "_id", as: "report"
                }
            }, {
                $project: { "password": 0, "token": 0 }
            }
        ])
        console.log('value', value)
        return res.status(200).json({ success: true, message: "User data fetch successfully.", data: value })
        // }
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: "Internal server error", success: false })
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
            // data update method
            const response = await user.findByIdAndUpdate({ _id: req.params.id }, req.body);
            console.log('response', response)

            if (response) {
                return res.status(200).json({ success: true, message: "User update successfully." })
            } else {
                return res.status(404).json({ success: false, message: "User not found." })
            }
        }
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: "Internal server error", success: false })
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
        console.log('error', error)
        res.status(500).json({ message: "Internal server error", success: false })
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
        console.log('error', error)
        res.status(500).json({ message: "Internal server error", success: false })
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
        console.log('error', error)
        res.status(500).json({ message: "Internal server error", success: false })
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
        console.log('error', error)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

// change profile image
const changeImage = async (req, res) => {
    console.log(req.file)
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


module.exports = { createUser, activeUser, getUser, updateUser, deleteUser, updateStatusUser, checkEmail, checkEmployeeId, changeImage, changePassword }