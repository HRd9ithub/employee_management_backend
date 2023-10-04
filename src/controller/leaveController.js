let expressValidator = require("express-validator");
const Leave = require("../models/leaveSchema");
const moment = require("moment");

// add leave
const addLeave = async (req, res) => {
    let { user_id, leave_type_id, from_date, to_date, leave_for, duration, reason, status } = req.body;
    try {
        const errors = expressValidator.validationResult(req)

        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: err, success: false })
        }

        let checkData = await Leave.find({
            user_id : user_id || req.user._id,
            $or: [
                {$and : [
                    { 'from_date': { $gte: from_date } },
                    { 'from_date': { $lte: to_date } },
                ]},
                {$and : [
                    { 'to_date': { $gte: from_date } },
                    { 'to_date': { $lte: to_date } },
                ]}
            ]
        })

        if(checkData.length !== 0) return res.status(400).json({ error: ["It appears that the date you selected for your leave has already been used."], success: false})
         
        let leaveRoute = new Leave({ user_id: user_id || req.user._id, leave_type_id, from_date, to_date, leave_for, duration, reason, status })
        let response = await leaveRoute.save()

        res.status(201).json({ message: "Leave create successfully.", success: true,checkData:checkData})
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// get leave
const getLeave = async (req, res) => {
    try {
        let leaveData = []
        if (req.permissions.name.toLowerCase() !== "admin") {
            leaveData = await Leave.aggregate([
                { $match: { user_id: req.user._id } },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $lookup:
                    {
                        from: "leavetypes",
                        localField: "leave_type_id",
                        foreignField: "_id",
                        as: "leaveType"
                    }
                },
                {
                    $unwind:
                    {
                        path: "$user",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        "user_id": 1,
                        "leave_type_id": 1,
                        "from_date": 1,
                        "to_date": 1,
                        "leave_for": 1,
                        "duration": 1,
                        "reason": 1,
                        "status": 1,
                        "createdAt": 1,
                        "leaveType": { $first: "$leaveType.name" },
                        "user.employee_id": 1,
                        "user.profile_image": 1,
                        "user.first_name": 1,
                        "user.last_name": 1,
                        "user.status": 1,
                    }
                }
            ])
        } else {
            leaveData = await Leave.aggregate([
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "user_id",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $match: {
                        "user.delete_at": { $exists: false },
                        "user.joining_date" : {"$lte" : new Date(moment(new Date()).format("YYYY-MM-DD"))},
                        $or: [ 
                            {"user.leaveing_date": {$eq: null}}, 
                            {"user.leaveing_date": {$gt: new Date(moment(new Date()).format("YYYY-MM-DD"))}}, 
                        ]
                    }
    
                },
                {
                    $lookup:
                    {
                        from: "leavetypes",
                        localField: "leave_type_id",
                        foreignField: "_id",
                        as: "leaveType"
                    }
                },
                {
                    $unwind:
                    {
                        path: "$user",
                        preserveNullAndEmptyArrays: true
                    }
                },
                {
                    $project: {
                        "user_id": 1,
                        "leave_type_id": 1,
                        "from_date": 1,
                        "to_date": 1,
                        "leave_for": 1,
                        "duration": 1,
                        "reason": 1,
                        "status": 1,
                        "leaveType": { $first: "$leaveType.name" },
                        "user.employee_id": 1,
                        "user.profile_image": 1,
                        "user.first_name": 1,
                        "user.last_name": 1,
                        "user.status": 1,
                        "createdAt": 1,
                    }
                }
            ])
        }

        res.status(200).json({ message: "Leave data fetch successfully.", success: true, data: leaveData, permissions: req.permissions })
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// single get leave 
const singleGetLeave = async (req, res) => {
    try {
        let { id } = req.params;

        const leaveData = await Leave.findOne({ _id: id })

        res.status(200).json({ message: "Leave data fetch successfully.", success: true, data: leaveData })
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// update leave
const updateLeave = async (req, res) => {
    let { user_id, leave_type_id, from_date, to_date, leave_for, duration, reason, status } = req.body;
    let { id } = req.params;
    try {
        const errors = expressValidator.validationResult(req)

        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: err, success: false })
        }

        let checkData = await Leave.find({
            user_id : user_id || req.user._id,
            $or: [
                {$and : [
                    { 'from_date': { $gte: from_date } },
                    { 'from_date': { $lte: to_date } },
                    {"_id" : {$ne : id}}
                ]},
                {$and : [
                    { 'to_date': { $gte: from_date } },
                    { 'to_date': { $lte: to_date } },
                    {"_id" : {$ne : id}}
                ]}
            ],
            
        });

        if(checkData.length !== 0) return res.status(400).json({ error: ["It appears that the date you selected for your leave has already been used."], success: false})
         

        const leave_detail = await Leave.findByIdAndUpdate({ _id: id }, {
            user_id: user_id || req.user._id, leave_type_id, from_date, to_date, leave_for, duration, reason, status
        }, { new: true })

        if (leave_detail) {
            return res.status(200).json({ message: "Leave edited successfully.", success: true })
        } else {
            return res.status(404).json({ message: "Leave is not found.", success: false })
        }
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// change status by id
const changeStatus = async (req, res) => {
    let { id } = req.params;
    let { status } = req.body;
    try {
        const errors = expressValidator.validationResult(req)

        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: err, success: false })
        }

        const leave_detail = await Leave.findByIdAndUpdate({ _id: id }, {
            status
        }, { new: true })

        if (leave_detail) {
            return res.status(200).json({ message: "Status Updated successfully.", success: true })
        } else {
            return res.status(404).json({ message: "Leave is not found.", success: false })
        }

    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// change status view all
const allChangeStatus = async (req, res) => {
    try {
        const leave_detail = await Leave.updateMany({ status: "Pending" }, {
            status: "Read"
        }, { new: true })

        if (leave_detail.matchedCount !== 0) {
            return res.status(200).json({ message: "Status Updated successfully.", success: true })
        } else {
            return res.status(404).json({ message: "Leave is not found.", success: false })
        }

    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

const getNotifications = async (req, res) => {
    try {
        let leaveData = await Leave.aggregate([
            { $match: { status: "Pending" } },
            {
                $lookup:
                {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user"
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
            {
                $lookup:
                {
                    from: "leavetypes",
                    localField: "leave_type_id",
                    foreignField: "_id",
                    as: "leaveType"
                }
            },
            {
                $unwind:
                {
                    path: "$user",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    "user_id": 1,
                    "leave_type_id": 1,
                    "from_date": 1,
                    "to_date": 1,
                    "leave_for": 1,
                    "duration": 1,
                    "reason": 1,
                    "status": 1,
                    "leaveType": { $first: "$leaveType.name" },
                    "user.employee_id": 1,
                    "user.profile_image": 1,
                    "user.first_name": 1,
                    "user.last_name": 1,
                    "user.status": 1,
                }
            }
        ])
        res.status(200).json({ message: "Notification data fetch successfully.", success: true, data: leaveData })
    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

module.exports = { addLeave, getLeave, singleGetLeave, updateLeave, changeStatus, allChangeStatus, getNotifications }