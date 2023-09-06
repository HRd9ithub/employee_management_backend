const expressValidator = require("express-validator");
const department = require("../models/departmentSchema");

// create department function
const createDepartment = async (req, res) => {
    try {
        const errors = expressValidator.validationResult(req)

        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: err, success: false })
        }

        // find department name in database
        const data = await department.findOne({ name: { $regex: new RegExp('^' + req.body.name, 'i') } });

        if (data) {
            // exists department name for send message
            return res.status(400).json({ message: "Department name already exists.", success: false })
        }

        // not exists department name for add database
        const departmentData = new department(req.body);
        const response = await departmentData.save();
        console.log('response', response)
        return res.status(201).json({ success: true, message: "Successfully added a new department." })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// update department function
const updateDepartment = async (req, res) => {
    try {
        const errors = expressValidator.validationResult(req)

        let err = errors.array().map((val) => {
            return val.msg
        })
        // check data validation error
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: err, success: false })
        }

        // find department name in database
        const data = await department.findOne({ name: { $regex: new RegExp('^' + req.body.name, 'i') } });

        if (data && data._id != req.params.id) {
            // exists department name for send message
            return res.status(400).json({ message: "Department name already exists.", success: false })
        }

        // not exists department name for update database
        const response = await department.findByIdAndUpdate({ _id: req.params.id }, req.body)
        
        if (response) {
            return res.status(200).json({ success: true, message: "Successfully edited a department." })
        } else {
            return res.status(404).json({ success: false, message: "Department is not found." })
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// update department function
const deleteDepartment = async (req, res) => {
    try {
        const response = await department.findByIdAndDelete({ _id: req.params.id })
        console.log('response', response)
        if (response) {
            return res.status(200).json({ success: true, message: "Successfully deleted a department." })
        } else {
            return res.status(404).json({ success: false, message: "Department is not found." })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// get department function
const getDepartment = async (req, res) => {
    try {
        // get department data in database
        const data = await department.find()
        console.log('data', data)

        return res.status(200).json({ success: true, message: "Successfully fetch a department data.", data: data,permissions : req.permissions })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

// check department existing function
const checkDepartment = async (req, res) => { 
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

        const response = await department.findOne({ name: { $regex: new RegExp('^' + req.body.name, 'i') }});

        if(response){
            return res.status(400).json({ success: false, message: "Department name already exists." })
        }
        return res.status(200).json({ success: true, message: "Department name not exist"})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message || 'Internal server Error', success: false })
    }
}

module.exports = { createDepartment, updateDepartment, deleteDepartment, getDepartment,checkDepartment }