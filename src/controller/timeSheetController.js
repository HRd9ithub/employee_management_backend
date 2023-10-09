
const moment = require("moment")
const timeSheet = require("../models/timeSheetSchema");
const { default: mongoose } = require("mongoose");


// get time sheet 
const getTimeSheet = async (req, res) => {
    let { id, startDate, endDate } = req.query;
    try {
        var a = moment(startDate ,"YYYY-MM-DD");
        var b = moment(endDate, "YYYY-MM-DD");
        a.isValid();
        if (!a.isValid() || !b.isValid()) {
            return res.status(400).json({ message: "Please enter startDate and endDate.", success: false })
        }

        let value = [];
        if (id || req.permissions.name.toLowerCase() !== "admin") {
            value = await timeSheet.aggregate([
                {
                    $match: {
                        $and: [
                            { date: { $gte: moment(startDate).format("YYYY-MM-DD") } },
                            { date: { $lte: moment(endDate).format("YYYY-MM-DD") } }],
                        user_id: new mongoose.Types.ObjectId(id || req.user._id)
                    }
                },
                {
                    $lookup: {
                        from: "users", localField: "user_id", foreignField: "_id", as: "user"
                    }
                },
                { $unwind: { path: "$user" } },
                {
                    $match: {
                        // "user.status": "Active",
                        "user.delete_at": { $exists: false },
                        "user.joining_date" : {"$lte" : new Date(moment(new Date()).format("YYYY-MM-DD"))},
                        $or: [ 
                            {"user.leaveing_date": {$eq: null}}, 
                            {"user.leaveing_date": {$gt: new Date(moment(new Date()).format("YYYY-MM-DD"))}}, 
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
                        "user_id": 1,
                        "date": 1,
                        "login_time": 1,
                        "logout_time": 1,
                        "total": 1,
                    }
                }
            ])
        } else {
            value = await timeSheet.aggregate([
                {
                    $match: {
                        $and: [
                            { date: { $gte: moment(startDate).format("YYYY-MM-DD") } },
                            { date: { $lte: moment(endDate).format("YYYY-MM-DD") } }
                        ]
                    }
                },
                {
                    $lookup: {
                        from: "users", localField: "user_id", foreignField: "_id", as: "user"
                    }
                },
                {
                    $match: {
                        // "user.status": "Active",
                        "user.delete_at": { $exists: false },
                        "user.joining_date" : {"$lte" : new Date(moment(new Date()).format("YYYY-MM-DD"))},
                        $or: [ 
                            {"user.leaveing_date": {$eq: null}}, 
                            {"user.leaveing_date": {$gt: new Date(moment(new Date()).format("YYYY-MM-DD"))}}, 
                        ]
                    }
                },
                { $unwind: { path: "$user" } },
                {
                    $project: {
                        "user.employee_id": 1,
                        "user.first_name": 1,
                        "user.last_name": 1,
                        "user.status": 1,
                        "user.profile_image": 1,
                        "user_id": 1,
                        "date": 1,
                        "login_time": 1,
                        "logout_time": 1,
                        "total": 1,
                    }
                }
            ])
        }
        res.status(200).json({ message: "Time sheet data fetch successfully.", success: true,data :value,permissions: req.permissions})
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

module.exports = { getTimeSheet }