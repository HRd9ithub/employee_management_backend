const mongoose = require('mongoose');

// document structure define 
const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})


// create collection
const menu = new mongoose.model("menu", menuSchema)

module.exports = menu