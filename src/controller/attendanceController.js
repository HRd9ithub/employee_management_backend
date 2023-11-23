const expressValidator = require("express-validator");
const moment = require("moment");
const attendance = require("../models/attendanceSchema");
const { default: mongoose } = require("mongoose");
const decryptData = require("../helper/decryptData");


// add login time
const addLogin = async (req, res) => {
    try {

        const errors = expressValidator.validationResult(req)

        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: err, success: false })
        }

        const data = {
            userId: req.user._id,
            date: new Date(),
            login_time: req.body.login_time
        }

        // add database data
        let response = await attendance.create(data)

        return res.status(201).json({
            message: "Data added successfully.",
            success: true
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message || "Interner server error",
            success: false
        })
    }
}

// add logout time
const addLogout = async (req, res) => {
    try {

        const { id } = req.params;

        const errors = expressValidator.validationResult(req)

        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: err, success: false })
        }

        // generate total hours
        req.body.totalHours = moment.utc(moment(req.body.logout_time, "HH:mm:ss").diff(moment(req.body.login_time, "HH:mm:ss"))).format("HH:mm")

        const attendanceData = await attendance.findByIdAndUpdate({ _id: id }, req.body)

        if (attendanceData) {
            return res.status(200).json({
                message: "Data updated successfully.",
                success: true
            })
        } else {
            return res.status(404).json({
                message: "Record not found.",
                success: false
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Interner server error",
            success: false
        })
    }
}

// get list of attendance
const getAttendance = async (req, res) => {
    try {
        const { id, startDate, endDate } = req.query;
        const identify = id || req.permissions?.name?.toLowerCase() !== "admin";

        const value = await attendance.aggregate([
            {
                $match: {
                    userId: !identify ? { $nin: [] } : { $eq: new mongoose.Types.ObjectId(id || req.userId) }
                }
            },
            {
                $lookup: {
                    from: "users", localField: "userId", foreignField: "_id", as: "user"
                }
            },
            { $unwind: { path: "$user" } },
            {
                $match: {
                    // "user.status": "Active",
                    "user.delete_at": { $exists: false },
                    "user.joining_date": { "$lte": new Date(moment(new Date()).format("YYYY-MM-DD")) },
                    $or: [
                        { "user.leaveing_date": { $eq: null } },
                        { "user.leaveing_date": { $gt: new Date(moment(new Date()).format("YYYY-MM-DD")) } },
                    ]
                }
            },
            {
                $project: {
                    "user.employee_id": 1,
                    "user.first_name": 1,
                    "user.last_name": 1,
                    "user.status": 1,
                    "user.profile_image": 1,
                    "userId": 1,
                    "date": 1,
                    "login_time": 1,
                    "logout_time": 1,
                    "totalHours": 1,
                }
            }
        ])

        const result = value.map((val) => {
            return {
                ...val,
                user: {
                    first_name: decryptData(val.user.first_name),
                    last_name: decryptData(val.user.last_name),
                    status: val.user.status,
                }
            }
        })

        const currentData = await attendance.find({createdAt : moment(new Date()).format("YYYY-MM-DD")});

        const toggle = currentData.every((val) => {
            return !val.logout_time
        })

        return res.status(200).json({
            success: true,
            message: 'Successfully fetched data',
            data: result,
            toggle,
            currentData
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Interner server error",
            success: false
        })
    }
}


module.exports = { addLogin, addLogout,getAttendance }