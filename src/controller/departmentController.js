const department = require("../models/departmentSchema");

// craete department function
const createDepartment = async (req, res) => {
    try {
        console.log('req.body', req.body)
        // find department name in database
        const data = await department.findOne({ name: req.body.name })
        console.log('data', data)
        if (data) {
            // exists department name for send message
            return res.status(400).json({ message: "The department name already exists.", success: false })
        }

        // not exists department name for add database
        const departmentData = new department(req.body);
        const response = await departmentData.save();
        console.log('response', response)
        return res.status(201).json({ success: true, message: "Successfully added a new department." })

    } catch (error) {
        console.log('error =======> ', error);
        res.status(500).send("Internal server error")
    }
}

// update department function
const updateDepartment = async (req, res) => {
    try {
        console.log('req.body', req.body)
        // find department name in database
        const data = await department.findOne({ name: req.body.name })
        console.log('data', data)
        if (data && data._id != req.params.id) {
            // exists department name for send message
            return res.status(400).json({ message: "The department name already exists.", success: false })
        }

        // not exists department name for update database
        const response = await department.findByIdAndUpdate({ _id: req.params.id }, req.body)
        console.log('response', response)
        if(response){
            return res.status(200).json({ success: true, message: "Successfully edited a department." })
        }else{
            return res.status(404).json({ success: false, message: "Department is not found." })
        }

    } catch (error) {
        console.log('error =======> ', error);
        res.status(500).send("Internal server error")
    }
}

// update department function
const deleteDepartment = async (req, res) => {
    try {
        const response = await department.findByIdAndDelete({ _id: req.params.id })
        console.log('response', response)
        if(response){
            return res.status(200).json({ success: true, message: "Successfully deleted a department." })
        }else{
            return res.status(404).json({ success: false, message: "Department is not found." })
        }

    } catch (error) {
        console.log('error =======> ', error);
        res.status(500).send("Internal server error")
    }
}

// get department function
const getDepartment = async (req, res) => {
    try {
        // get department data in database
        const data = await department.find()
        console.log('data', data)

        return res.status(200).json({ success: true, message: "Successfully fetch a department data.",data:data })

    } catch (error) {
        console.log('error =======> ', error);
        res.status(500).send("Internal server error")
    }
}



module.exports = { createDepartment, updateDepartment,deleteDepartment,getDepartment }