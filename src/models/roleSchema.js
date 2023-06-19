const mongoose = require('mongoose');


const permissionSchema = new mongoose.Schema({
    menuId:{
        type: mongoose.Schema.Types.ObjectId
    },
    list:{
        type:Number,
        default:0
    },
    create:{
        type:Number,
        default:0
    },
    update:{
        type:Number,
        default:0
    },
    delete : {
        type:Number,
        default:0
    }
})


// document structure define 
const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    permissions : [{
        menuId:{
            type: mongoose.Schema.Types.ObjectId
        },
        list:{
            type:Number,
            default:0
        },
        create:{
            type:Number,
            default:0
        },
        update:{
            type:Number,
            default:0
        },
        delete : {
            type:Number,
            default:0
        }
    }]
})



// create collection
const role = new mongoose.model("role", roleSchema)

module.exports = role