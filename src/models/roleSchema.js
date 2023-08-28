const mongoose = require('mongoose');

// document structure define 
const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    permissions :[Object]
},{
    timestamps:true
})



// create collection
const role = new mongoose.model("role", roleSchema)

module.exports = role