const expressValidator = require("express-validator");
const moment = require("moment");
const attendance = require("../models/attendanceSchema");
const { default: mongoose } = require("mongoose");
const decryptData = require("../helper/decryptData");
const user = require("../models/UserSchema");
const regulationMail = require("../Handler/regulationEmail");


// add clockIn time
const clockIn = async (req, res) => {
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
            timestamp: moment(new Date()).format("YYYY-MM-DD"),
            clock_in: req.body.clock_in
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
const clockOut = async (req, res) => {
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

        const record = await attendance.findOne({_id : id})

        // generate total hours
        req.body.totalHours = moment.utc(moment(req.body.clock_out, "HH:mm:ss").diff(moment(record.clock_in, "HH:mm:ss"))).format("HH:mm")

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

        const identify = req.permissions?.name?.toLowerCase() !== "admin";

        const value = await attendance.aggregate([
            {
                $match: {
                    $and: [
                        { timestamp: { $gte: new Date(startDate) } },
                        { timestamp: { $lte: new Date(endDate) } }
                    ],
                    userId: !identify ? { $nin: [] } : { $eq: new mongoose.Types.ObjectId(req.user._id) }
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
                    "timestamp": 1,
                    "clock_in": 1,
                    "clock_out": 1,
                    "totalHours": 1,
                }
            }
        ])

        const result = value.map((val) => {
            return {
                ...val,
                user: {
                    name : decryptData(val.user.first_name).concat(" ",decryptData(val.user.last_name)),
                    status: val.user.status,
                }
            }
        })

        const currentData = await attendance.find({ timestamp: moment(new Date()).format("YYYY-MM-DD"), userId : req.user._id }).sort({createdAt : -1});


        return res.status(200).json({
            success: true,
            message: 'Successfully fetched data',
            data: result,
            currentData,
            permissions :req.permissions
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || "Interner server error",
            success: false
        })
    }
}

// regulation mail send function
const sendRegulationMail = async (req, res) => {
    try {
        const { clockIn, clockOut, explanation, userId, timestamp} = req.body;

        const user = await user.findOne({ _id: userId })
        if (!user) {
            return res.status(404).json({success: false,message: 'Employee not found'})
        }
        const userName = decryptData(user.first_name).concat(" " ,decryptData(user.last_name));

        // get email id for send mail
        const maillist = await user.aggregate([
            { 
                $lookup :
                {
                    from : "roles",
                    localField : "role_id",
                    foreignField : "_id",
                    as : "role"
                }
            },
            {$unwind : {path : "$role"}},
            {
                $match :
                {
                    "role.name" : { $in: ["ADMIN", "admin", "Admin"] }
                }
            },
            {
                $project : 
                {
                    email : 1 
                }
            }
        ]);

        const response = await regulationMail(res,maillist,clockIn, clockOut, explanation, timestamp,userName);

        console.log('response :>> ', response);

    }catch(error){

    }
}

module.exports = { clockIn, clockOut, getAttendance, sendRegulationMail}