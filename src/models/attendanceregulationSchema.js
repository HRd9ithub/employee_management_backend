const mongoose = require("mongoose");



const attendanceRegulationSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required : true
    },
    clock_in:{
        type : String
    },
    clock_out:{
        type : String
    },
    explanation:{
        type : String,
        required : true
    },
    attendanceId :{
        type : mongoose.Schema.Types.ObjectId,
        required : true,
        ref:'Attendance'
    }
});

const attendanceRegulation = new mongoose.model("attendanceRegulation",attendanceRegulationSchema);

module.exports = attendanceRegulation;