const mongoose = require('mongoose');

// document structure define 
const timeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    login_time: {
        type: String,
        required: true
    },
    logout_time: {
        type: String
    },
    total: {
        type: String
    }
},
    {
        timestamps: true,
    }
)

// create collection
const timeSheet = new mongoose.model("timesheet", timeSchema)

module.exports = timeSheet