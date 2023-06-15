const mongoose = require('mongoose');

// document structure define 
const departmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})


// create collection
const department = new mongoose.model("department", departmentSchema)

module.exports = department