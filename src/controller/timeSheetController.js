const expressValidator = require("express-validator");
const timeSheet = require("../models/timeSheetSchema");


// add login time function

const addLoginTime = async (req, res) => {

    try {
        const errors = expressValidator.validationResult(req)
        console.log('errors', errors)
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array(), success: false })
        }

        // add userId
        req.body.userId = req.user._id
        req.body.date = new Date().toLocaleDateString()


        // add data database
        const timeData = new timeSheet(req.body);

        const response = await timeData.save();
        return res.status(201).json({ success: true, message: "Successfully added a login time." })
    } catch (error) {
        console.log('error', error)
        return res.status(500).send("internal server error")
    }
}
// add login time function

const addLogoutTime = async (req, res) => {

    try {
        const errors = expressValidator.validationResult(req)
        console.log('errors', errors)
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: errors.array(), success: false })
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
        return res.status(500).send("internal server error")
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
const getSingleData = async(req,res) =>{ 
    try {
        const today = new Date().toLocaleDateString()
        // get single dat in query
        const singleData = await timeSheet.find({userId:req.user._id,date:{$eq: today}})

        return res.status(200).json({success : true,message:"data fetch is successfully.",data:singleData})
    } catch (error) {
        console.log('error', error)
        res.status(500).send("internal server.")
    }
}

module.exports = { addLoginTime, addLogoutTime, getTimeSheet,getSingleData }