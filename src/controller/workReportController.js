const expressValidator = require("express-validator");
const user = require("../models/UserSchema");
const project = require("../models/projectSchema");
const report = require("../models/workReportSchema");
const Leave = require("../models/leaveSchema");
const holiday = require("../models/holidaySchema");
let moment = require("moment");
const { default: mongoose } = require("mongoose");



const createReport = async (req, res) => {
    try {
        let { userId, projectId, description, hours } = req.body;

        const errors = expressValidator.validationResult(req)

        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: err, success: false })
        }

        let error = []
        // user id check 
        let users = await user.findOne({ _id: req.body.userId || req.user._id })
        if (!users) { error.push("User is not exists.") }

        // project id check
        let projects = await project.findOne({ _id: req.body.projectId })
        if (!projects) { error.push("The project does not exist.") }

        if (error.length !== 0) return res.status(422).json({ error: error, success: false });

        let reports = await report.findOne({
            $and: [
                { "userId": { $eq:new mongoose.Types.ObjectId(userId || req.user._id)} },
                { "date": { $eq: moment(new Date()).format("YYYY-MM-DD") } },
            ]
        })
        if(reports){
            return res.status(400).json({ success: true, error: ["Please note that you are only able to submit one report per day."] })
        }

        const reportData = new report({ userId: userId || req.user._id, projectId, description, hours, date: moment(new Date()).format("YYYY-MM-DD") });
        const response = await reportData.save();
        return res.status(201).json({ success: true, message: "Data added successfully." })

    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// update report 
const updateReport = async(req,res) => {
    try {
        let { userId, projectId, description, hours } = req.body;

        const errors = expressValidator.validationResult(req)

        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: err, success: false })
        }

        let error = []
        // user id check 
        let users = await user.findOne({ _id: req.body.userId })
        if (!users) { error.push("User is not exists.") }

        // project id check
        let projects = await project.findOne({ _id: req.body.projectId })
        if (!projects) { error.push("The project does not exist.") }

        if (error.length !== 0) return res.status(422).json({ error: error, success: false });

        let updateData = await report.findByIdAndUpdate({_id : req.params.id},{userId, projectId, description, hours},{new : true})

        if(updateData){
            return res.status(200).json({ success: true, message: "Data updated successfully." })
        }else{
            return res.status(404).json({ success: false, message: "Record is not found." })
        }

    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// get report function
const getReport = async (req, res) => {
    try {
        let { id, startDate, endDate } = req.query;

        // req.permissions.name.toLowerCase() === "admin" ?
        // get project data in database
        let data = await report.aggregate([
            {
                $match: {
                    $and: [
                        { date: { $gte: moment(startDate).format("YYYY-MM-DD") } },
                        { date: { $lte: moment(endDate).format("YYYY-MM-DD") } }],
                    userId: new mongoose.Types.ObjectId(id || req.user._id)
                }
            },
            {
                $lookup: {
                    from: "users", localField: "userId", foreignField: "_id", as: "user"
                }
            },
            { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "projects", localField: "projectId", foreignField: "_id", as: "project"
                }
            },
            { $unwind: { path: "$project", preserveNullAndEmptyArrays: true } },
            {
                $project: {

                    userId: 1,
                    projectId: 1,
                    description: 1,
                    hours: 1,
                    date: 1,
                    updatedAt: 1,
                    "user.employee_id": 1,
                    "user.profile_image": 1,
                    "user.first_name": 1,
                    "user.status": 1,
                    "user.last_name": 1,
                    "project.name": 1
                }
            }
        ])


        let data1 = await Leave.find({
            user_id: new mongoose.Types.ObjectId(id || req.user._id),
            $and: [
                { "from_date": { $gte: moment(startDate).format("YYYY-MM-DD") } },
                { "to_date": { $lte: moment(endDate).format("YYYY-MM-DD") } },
            ]
        })
        let data2 = await holiday.find({
            $and: [
                { "date": { $gte: moment(startDate).format("YYYY-MM-DD") } },
                { "date": { $lte: moment(endDate).format("YYYY-MM-DD") } },
            ]
        })

        let filterData = [...data, ...data2]

        data1.forEach((val) => {
            var from_date = moment(val.from_date);
            var to_date = moment(val.to_date);
            let day = to_date.diff(from_date, 'days');
            filterData.push({ date: val.from_date, name: "Leave" })
            for (let index = 1; index <= day; index++) {
                var new_date = moment(val.from_date).add(index, "d");
                filterData.push({ date: moment(new_date).format("YYYY-MM-DD"), name: "Leave" })
            }
        })
        var mstartDate = moment(startDate);
        var mendDate = moment(endDate);
        let days = mendDate.diff(mstartDate, 'days');
        for (let index = 0; index <= days; index++) {
            var new_date = moment(startDate).add(index, "d");
            if (moment(new_date).format("dddd") == "Saturday" || moment(new_date).format("dddd") == "Sunday") {
                filterData.push({ date: moment(new_date).format("YYYY-MM-DD"), name: moment(new_date).format("dddd") })
            }
        }

        let finalData = [];

        filterData.map((val) => {
            if (finalData.length === 0) {
                finalData.push(val)
            } else {
                let isDublication = finalData.findIndex((elem) => {
                    return val.date == elem.date
                })
                if (isDublication === -1) {
                    finalData.push(val)

                }
            }
        });


        let Test = finalData.sort(function (a, b) {
            return new Date(a.date) - new Date(b.date)
        });


        return res.status(200).json({ success: true, message: "Successfully fetch a work report data.", data: Test, permissions: req.permissions })

    } catch (error) {
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}


module.exports = { createReport, getReport,updateReport }