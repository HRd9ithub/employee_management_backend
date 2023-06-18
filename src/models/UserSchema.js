const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")

// document structure define 
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Male', 'Female']
    },
    dateOfBirth: {
        type: Date,
        required: true
    },
    joiningDate: {
        type: Date,
        required: true
    },
    bloodGroup: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['Active', 'Inactive']
    },
    // image: {
    //     type: String,
    //     required: true
    // },
    country: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    postCode: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    roleId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    departmentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    designationId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    otp: {
        type: Number
    },
    create_Date: {
        type: Date,
        default: Date.now
    },
    delete_Date: {
        type: Date,
        default:null
    },
    update_Date: {
        type: Date
    }
})

// password convert
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        console.log('this.password', this.password)
        this.password = await bcrypt.hash(this.password, 10)
        // console.log('this.password', this.password)
    }
    next()
})

// create collection
const user = new mongoose.model("user", userSchema)

module.exports = user