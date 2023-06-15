const holiday = require("../models/holidaySchema");

// create holiday function
const createHoliday = async (req, res) => {
    try {
        console.log('req.body', req.body)

        const holidayData = new holiday(req.body);
        const response = await holidayData.save();
        console.log('response', response)
        return res.status(201).json({ success: true, message: "Successfully added a new holiday." })

    } catch (error) {
        console.log('error =======> ', error);
        res.status(500).send("Internal server error")
    }
}

// update holiday function
const updateHoliday = async (req, res) => {
    try {
        const response = await holiday.findByIdAndUpdate({ _id: req.params.id }, req.body)
        console.log('response', response)
        if (response) {
            return res.status(200).json({ success: true, message: "Successfully edited a holiday." })
        } else {
            return res.status(404).json({ success: false, message: "Holiday is not found." })
        }
    } catch (error) {
        console.log('error =======> ', error);
        res.status(500).send("Internal server error")
    }
}

// update holiday function
const deleteHoliday = async (req, res) => {
    try {
        const response = await holiday.findByIdAndDelete({ _id: req.params.id })
        console.log('response', response)
        if (response) {
            return res.status(200).json({ success: true, message: "Successfully deleted a holiday." })
        } else {
            return res.status(404).json({ success: false, message: "Holiday is not found." })
        }
    } catch (error) {
        console.log('error =======> ', error);
        res.status(500).send("Internal server error")
    }
}

// get holiday function
const getHoliday = async (req, res) => {
    try {
        // get holiday data in database
        const data = await holiday.find()
        console.log('data', data)

        return res.status(200).json({ success: true, message: "Successfully fetch a holiday data.", data: data })

    } catch (error) {
        console.log('error =======> ', error);
        res.status(500).send("Internal server error")
    }
}



module.exports = { createHoliday, updateHoliday, deleteHoliday, getHoliday }