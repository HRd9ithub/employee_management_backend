const leaveType = require("../models/leaveTypeSchema");

// craete leaveType function
const createleaveType = async (req, res) => {
    try {
        console.log('req.body', req.body)
        // find leaveType name in database
        const data = await leaveType.findOne({ name: req.body.name })
        console.log('data', data)
        if (data) {
            // exists leaveType name for send message
            return res.status(400).json({ message: "The leaveType name already exists.", success: false })
        }

        // not exists leaveType name for add database
        const leaveTypeData = new leaveType(req.body);
        const response = await leaveTypeData.save();
        console.log('response', response)
        return res.status(201).json({ success: true, message: "Successfully added a new leaveType." })

    } catch (error) {
        console.log('error =======> ', error);
        res.status(500).send("Internal server error")
    }
}

// update leaveType function
const updateleaveType = async (req, res) => {
    try {
        console.log('req.body', req.body)
        // find leaveType name in database
        const data = await leaveType.findOne({ name: req.body.name })
        console.log('data', data)
        if (data && data._id != req.params.id) {
            // exists leaveType name for send message
            return res.status(400).json({ message: "The leaveType name already exists.", success: false })
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
        res.status(500).send("Internal server error")
    }
}

// delete leaveType function
const deleteleaveType = async (req, res) => {
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
        res.status(500).send("Internal server error")
    }
}

// get leaveType function
const getleaveType = async (req, res) => {
    try {
        // get leaveType data in database
        const data = await leaveType.find()
        console.log('data', data)

        return res.status(200).json({ success: true, message: "Successfully fetch a leaveType data.",data:data })

    } catch (error) {
        console.log('error =======> ', error);
        res.status(500).send("Internal server error")
    }
}



module.exports = { createleaveType, updateleaveType,deleteleaveType,getleaveType }