const designation = require("../models/designationSchema");

// craete designation function
const createDesignation = async (req, res) => {
    try {
        console.log('req.body', req.body)
        // find designation name in database
        const data = await designation.findOne({ name: req.body.name })
        console.log('data', data)
        if (data) {
            // exists designation name for send message
            return res.status(400).json({ message: "The designation name already exists.", success: false })
        }

        // not exists designation name for add database
        const designationData = new designation(req.body);
        const response = await designationData.save();
        console.log('response', response)
        return res.status(201).json({ success: true, message: "Successfully added a new designation." })

    } catch (error) {
        console.log('error =======> ', error);
        res.status(500).send("Internal server error")
    }
}

// update designation function
const updateDesignation = async (req, res) => {
    try {
        console.log('req.body', req.body)
        // find designation name in database
        const data = await designation.findOne({ name: req.body.name })
        console.log('data', data)
        if (data && data._id != req.params.id) {
            // exists designation name for send message
            return res.status(400).json({ message: "The designation name already exists.", success: false })
        }

        // not exists designation name for update database
        const response = await designation.findByIdAndUpdate({ _id: req.params.id }, req.body)
        console.log('response', response)
        if(response){
            return res.status(200).json({ success: true, message: "Successfully edited a designation." })
        }else{
            return res.status(404).json({ success: false, message: "Designation is not found." })
        }

    } catch (error) {
        console.log('error =======> ', error);
        res.status(500).send("Internal server error")
    }
}

// update designation function
const deleteDesignation = async (req, res) => {
    try {
        const response = await designation.findByIdAndDelete({ _id: req.params.id })
        console.log('response', response)
        if(response){
            return res.status(200).json({ success: true, message: "Successfully deleted a designation." })
        }else{
            return res.status(404).json({ success: false, message: "Designation is not found." })
        }

    } catch (error) {
        console.log('error =======> ', error);
        res.status(500).send("Internal server error")
    }
}

// get designation function
const getDesignation = async (req, res) => {
    try {
        // get designation data in database
        const data = await designation.find()
        console.log('data', data)

        return res.status(200).json({ success: true, message: "Successfully fetch a designation data.",data:data })

    } catch (error) {
        console.log('error =======> ', error);
        res.status(500).send("Internal server error")
    }
}



module.exports = { createDesignation, updateDesignation,deleteDesignation,getDesignation }