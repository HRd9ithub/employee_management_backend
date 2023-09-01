const leaveType = require("../models/leaveTypeSchema");
const expressValidator = require("express-validator");

// CREATE leaveType function
const createLeaveType = async (req, res) => {
    try {
        const errors = expressValidator.validationResult(req)

        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: err, success: false })
        }

        // find leaveType name in database
        const data = await leaveType.findOne({  name: { $regex: new RegExp('^' + req.body.name, 'i') } })

        if (data) {
            // exists leaveType name for send message
            return res.status(400).json({ message: "Leave Type already exists.", success: false })
        }

        // not exists leaveType name for add database
        const leaveTypeData = new leaveType(req.body);
        const response = await leaveTypeData.save();
        console.log('response', response)
        return res.status(201).json({ success: true, message: "Successfully added a new leaveType." })

    } catch (error) {
        console.log('error =======> ', error);
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

// update leaveType function
const updateLeaveType = async (req, res) => {
    try {
        const errors = expressValidator.validationResult(req)

        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: err, success: false })
        }

        // find leaveType name in database
        const data = await leaveType.findOne({  name: { $regex: new RegExp('^' + req.body.name, 'i') } })

        if (data && data._id != req.params.id) {
            // exists leaveType name for send message
            return res.status(400).json({ message: "Leave Type already exists.", success: false })
        }

        // not exists leaveType name for update database
        const response = await leaveType.findByIdAndUpdate({ _id: req.params.id }, req.body)
        console.log('response', response)
        if(response){
            return res.status(200).json({ success: true, message: "Successfully edited a leaveType." })
        }else{
            return res.status(404).json({ success: false, message: "LeaveType is not found." })
        }

    } catch (error) {
        console.log('error =======> ', error);
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

// delete leaveType function
const deleteLeaveType = async (req, res) => {
    try {
        const response = await leaveType.findByIdAndDelete({ _id: req.params.id })
        console.log('response', response)
        if(response){
            return res.status(200).json({ success: true, message: "Successfully deleted a leaveType." })
        }else{
            return res.status(404).json({ success: false, message: "LeaveType is not found." })
        }

    } catch (error) {
        console.log('error =======> ', error);
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

// get leaveType function
const getLeaveType = async (req, res) => {
    try {
        // get leaveType data in database
        const data = await leaveType.find()
        console.log('data', data)

        return res.status(200).json({ success: true, message: "Successfully fetch a leaveType data.",data:data })

    } catch (error) {
        console.log('error =======> ', error);
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

// check department existing function
const checkLeaveType = async (req, res) => { 
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

        const response = await leaveType.findOne({ name: { $regex: new RegExp('^' + req.body.name, 'i') }});

        if(response){
            return res.status(400).json({ success: false, message: "Leave Type already exists.." })
        }
        return res.status(200).json({ success: true, message: "Leave Type not exist"})
    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}



module.exports = { createLeaveType, updateLeaveType,deleteLeaveType,getLeaveType,checkLeaveType }