const user = require("../models/UserSchema")
const expressValidator = require("express-validator");

// create ACCOUNT detail function
const addAccount = async (req, res) => {
    try {
        console.log('req.body', req.body)
        const errors = expressValidator.validationResult(req)
        console.log('errors', errors)
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array(), success: false })
        }

        console.log(req.user)
        // if(req.user )


        // check email exist or not
        // const email = await user.findOne({ email: req.body.email })
        // console.log(email, "====> email")

        // if (email) {
        //     return res.status(400).json({ message: "email address already exists.", success: false })
        // } else {
        //     const userData = new user(req.body);
        //     const response = await userData.save();
        //     console.log('response', response)
        //     return res.status(201).json({ success: true, message: "user create successfully." })
        // }
    } catch (error) {
        console.log('error', error)
        res.status(500).send("internal server")
    }
}

// single user data fetch function
const activeUser = async (req, res) => {
    try {
        console.log('req.params', req.params)
        if (req.user) {
            const userData = await user.findOne({ _id: req.params.id }).select("-password");
            console.log('userData', userData)
            if (userData) {
                return res.status(200).json({ success: true, message: "User data fetch successfully.", data: userData })
            } else {
                return res.status(404).json({ success: false, message: "User is not found" })
            }
        }
    } catch (error) {
        console.log('error', error)
        res.status(500).send("internal server")
    }
}

// all user data fetch function
const getUser = async (req, res) => {
    try {
        if (req.user) {
           const value = await  user.aggregate([
                {
                    $lookup: {
                        from: "departments", localField: "departmentId", foreignField: "_id", as: "department"
                    }
                }, {
                    $lookup: {
                        from: "designations", localField: "designationId", foreignField: "_id", as: "designation"
                    }
                },{
                    $project : {"password":0}
                }
            ])
            console.log('value', value)
            return res.status(200).json({ success: true, message: "User data fetch successfully.", data: value })
        }
    } catch (error) {
        console.log('error', error)
        res.status(500).send("internal server")
    }
}

// update user data function
const updateUser = async (req, res) => {
    try {
        console.log('req.body', req.params)
        const errors = expressValidator.validationResult(req)
        console.log('errors', errors)
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array(), success: false })
        }
        // check email exist or not
        const data = await user.findOne({ email: req.body.email })
        console.log(data, "====> email")

        if (data && data._id != req.params.id) {
            return res.status(400).json({ message: "email address already exists.", success: false })
        } else {
            req.body.update_Date = Date.now()
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
        res.status(500).send("internal server")
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
            req.body.delete_Date = Date.now()
            // data update method
            const response = await user.findByIdAndUpdate({ _id: req.params.id }, { delete_Date: Date.now() });
            console.log('response', response)
            return res.status(200).json({ success: true, message: "User delete successfully." })
        }
    } catch (error) {
        console.log('error', error)
        res.status(500).send("internal server")
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
            const response = await user.findByIdAndUpdate({ _id: req.params.id }, { update_Date: Date.now(), status: data.status === 'Active' ? 'Inactive' : "Active" });
            console.log('response', response)
            return res.status(200).json({ success: true, message: "User status update successfully." })
        }
    } catch (error) {
        console.log('error', error)
        res.status(500).send("internal server")
    }
}

// check Email function
const checkEmail = async (req, res) => {
    try {
        const errors = expressValidator.validationResult(req)
        console.log('errors', errors)
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array(), success: false })
        }

        // check email exist or not
        const data = await user.findOne({ email: req.body.email })
        console.log(data, "====> check email")

        if (data) {
            return res.status(400).json({ message: "Email address already exists.", success: false })
        } else {
            return res.status(200).json({ success: true, message: "Email address not exists." })
        }
    } catch (error) {
        console.log('error', error)
        res.status(500).send("internal server")
    }
}


module.exports = { addAccount, activeUser, getUser, updateUser, deleteUser, updateStatusUser, checkEmail }