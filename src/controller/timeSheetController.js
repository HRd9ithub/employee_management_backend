const expressValidator = require("express-validator");
const timeSheet = require("../models/timeSheetSchema");


// add login time function

const addLoginTime = async (req, res) => {

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

        let data = await timeSheet.findOne({user_id : req.user._id,date : new Date().toLocaleDateString()});
        console.log(data,"data")
        if(!data){
            // add userId
            req.body.user_id = req.user._id
            req.body.date = new Date().toLocaleDateString()
    
            console.log(req.body)
            // add data database
            const timeData = new timeSheet(req.body);
    
            const response = await timeData.save();
        }
        return res.status(201).json({ success: true, message: "Successfully added a login time." })

    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}
// add login time function

const addLogoutTime = async (req, res) => {

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
        // update data database
        const findData = await timeSheet.find({ userId: req.user._id });
        console.log('findData', findData)
        const response = await timeSheet.findByIdAndUpdate({ _id: findData[findData.length - 1]._id }, req.body)

        if (response) {
            return res.status(201).json({ success: true, message: "Successfully added a logout time." })
        }

    } catch (error) {
        console.log('error', error)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

// all data get
const getTimeSheet = async (req, res) => {
    try {
        let response = await timeSheet.find();

        res.status(200).json({ success: true, message: "data fetch successfully.", data: response })

    } catch (error) {
        console.log('error', error)
        res.status(500).send("internal server error")
    }
}

// current date and user login data
const getSingleData = async (req, res) => {
    try {
        const today = new Date().toLocaleDateString()
        // get single dat in query
        const singleData = await timeSheet.find({ userId: req.user._id, date: { $eq: today } })

        return res.status(200).json({ success: true, message: "data fetch is successfully.", data: singleData })
    } catch (error) {
        console.log('error', error)
        res.status(500).send("internal server.")
    }
}

module.exports = { addLoginTime, addLogoutTime, getTimeSheet, getSingleData }