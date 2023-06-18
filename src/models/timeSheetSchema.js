const mongoose = require("mongoose");


const timeSheetSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    date:{
        type:String,
    },
    loginTime:{
        type:String
    },
    logoutTime:{
        type:String
    }
})


const timeSheet = new mongoose.model("timeSheet",timeSheetSchema)

module.exports = timeSheet