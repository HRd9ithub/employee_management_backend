const moment = require('moment');
const { Router } = require('express');
const Auth = require('../middleware/auth');
const user = require('../models/UserSchema');
const Leave = require('../models/leaveSchema');
const timeSheet = require('../models/timeSheetSchema');
const holiday = require('../models/holidaySchema');
const { default: mongoose } = require('mongoose');
const DashboardRoute = Router();

// Get all DashboardRoutes
DashboardRoute.get('/', Auth, async (req, res) => {
    try {
        let date = new Date().toISOString()

        const value = await user.aggregate([
            {
                $match: {
                    status: "Active",
                    delete_at: { $exists: false },
                }
            },
            {
                $lookup: {
                    from: "roles", localField: "role_id", foreignField: "_id", as: "role"
                }
            },
            { $unwind: { path: "$role" } },
            {
                $match: {
                    $expr: {
                        $and: [
                            { $ne: ["$role.name", "admin"] },
                            { $ne: ["$role.name", "Admin"] },
                        ],
                    },
                }
            },
            {
                $project: {
                    "leaveing_date": 1,
                    "_id": 1
                }
            }
        ])

        // leave request count
        let leaveRequest = await Leave.find({ status: "Pending" }).count();

        // today absent list
        let absentToday = await Leave.aggregate([{
            $match: {
                $expr: {
                    $and: [
                        { $eq: ["$status", "Approved"] },
                        { $lte: ["$from_date", moment(new Date()).format("YYYY-MM-DD")] },
                        { $gte: ["$to_date", moment(new Date()).format("YYYY-MM-DD")] },
                    ]
                },
            }
        },
        {
            $lookup: {
                from: "users", localField: "user_id", foreignField: "_id", as: "user"
            }
        },
        { $unwind: { path: "$user" } },
        {
            $project: {
                user_id: 1,
                "user.employee_id": 1,
                "user.first_name": 1,
                "user.last_name": 1,
                "user.profile_image": 1,
            }
        },
        ])

        // today present list
        let presentToday = await timeSheet.find({ date: moment(new Date()).format("YYYY-MM-DD") }).count();


        let data = value.filter((val) => {
            return (!val.leaveing_date || val.leaveing_date && new Date(val.leaveing_date).toISOString() > date)
        })

        // holiday list get
        let holidayDay = await holiday.find();

        // birthday list 
        let birthDay = await user.find({
            status: "Active",
            delete_at: { $exists: false },
            date_of_birth: { $exists: true },
            $or: [{ leaveing_date: { $exists: false } }, { leaveing_date: { $gt: new Date() } }],
        },
            { employee_id: 1, first_name: 1, last_name: 1, profile_image: 1, date_of_birth: 1 })

        // report by find
        // const reportBy = await user.aggregate([
        //     {
        //         $match: {report_by : new mongoose.Types.ObjectId(req.user._id)}
        //     },
        //     {
        //         $lookup: {
        //             from: "users", localField: "report_by", foreignField: "_id", as: "report_by"
        //         }
        //     },
        //     { $unwind: { path: "$report_by" } },
        //     {
        //         $match: {
        //             "report_by.delete_at" : { $exists: false },
        //             $expr: {
        //                 $and: [
        //                     { $eq: ["$report_by.status", "Active"] },
        //                 ],
        //             },
        //         }
        //     },
        //     {
        //         $project: {
        //             "employee_id": 1,
        //             "first_name": 1,
        //             "last_name": 1,
        //             "report_by._id": 1,
        //             "report_by.employee_id": 1,
        //             "report_by.first_name": 1,
        //             "report_by.last_name": 1,
        //         }
        //     }
        // ])
        const reportBy = await user.find({report_by : req.user._id },{first_name :1,last_name :1})

        res.status(200).json({ totalEmployee: data.length, leaveRequest, presentToday, absentToday, holidayDay, birthDay ,reportBy,success : true})

    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
})


module.exports = DashboardRoute