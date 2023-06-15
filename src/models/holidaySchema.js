const mongoose = require('mongoose');

// document structure define 
const holidaySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    date:{
        type:Date,
        required:true
    }
})


// create collection
const holiday = new mongoose.model("holiday", holidaySchema)

module.exports = holiday