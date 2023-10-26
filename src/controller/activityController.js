const activity_log = require("../models/activitySchema");
let moment = require("moment");

// get activity function
const getActivity = async (req, res) => {
    let { startDate, endDate } = req.query;
    try {
        startDate = startDate || moment(new Date()).format("YYYY-MM-DD");
        endDate = endDate || moment(new Date()).format("YYYY-MM-DD");

        let activityData = await activity_log.aggregate([
            {
                $match: {
                    $and: [
                        { "date": { $gte: startDate} },
                        { "date": { $lte: endDate } },
                    ]
                }
            },  // filter for all activities
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "User"
                }
            },
            {
                $unwind: {
                    path: "$User",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $match: {
                    // "user.status": "Active",
                    "User.delete_at": { $exists: false },
                    "User.joining_date": { "$lte": new Date(moment(new Date()).format("YYYY-MM-DD")) },
                    $or: [
                        { "User.leaveing_date": { $eq: null } },
                        { "User.leaveing_date": { $gt: new Date(moment(new Date()).format("YYYY-MM-DD")) } },
                    ]
                }

            },
            { $sort: { "createdAt": -1 } },
            {
                $project: {
                    "User.employee_id": 1,
                    "User.profile_image": 1,
                    "User.first_name": 1,
                    "User.last_name": 1,
                    "User.status": 1,
                    title: 1,
                    user_id: 1,
                    createdAt: 1
                }
            }
        ])
        res.status(200).json({ success: true, data: activityData, permissions: req.permissions ,date : new Date(moment(new Date()).format("YYYY-MM-DD"))})
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal Server Error', success: false });
    }
}


module.exports = getActivity