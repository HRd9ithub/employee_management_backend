const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")
var jwt = require('jsonwebtoken')

// document structure define 
const userSchema = new mongoose.Schema({
    employee_id: {
        type: String,
        required: true
    },
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
    reportTo: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    age: {
        type: Number,
    },
    address: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female']
    },
    dateOfBirth: {
        type: Date,
    },
    joiningDate: {
        type: Date,
        required: true
    },
    bloodGroup: {
        type: String,
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
    },
    state: {
        type: String,
    },
    city: {
        type: String,
    },
    postCode: {
        type: Number,
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
        default: null
    },
    update_Date: {
        type: Date
    },
    token:{
            type: String
        }
})

// generate token
userSchema.methods.generateToken = async function () {
    try {
        console.log('this._id :>> ', this._id);
        var token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
        console.log('token :>> ', token);
        this.token = token
        console.log('this.Tokens :>> ', this.Tokens);
        await this.save();
        return token

    } catch (error) {
        console.log('error :>> ', error);
    }
}

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