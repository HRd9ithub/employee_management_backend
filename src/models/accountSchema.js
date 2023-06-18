const mongoose = require('mongoose');

// document structure define 
const accountSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    bankName : {
        type:String,
        required : true,   
    },
    accountNumber:{
        type:Number,
        required:true
    },
    IFSC_Code:{
        type:String,
        required:true
    },
    branchName:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
    }
})


// create collection
const account = new mongoose.model("account", accountSchema)

module.exports = account