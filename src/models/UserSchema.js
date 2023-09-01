const mongoose = require('mongoose');
const bcrypt = require("bcryptjs")
var jwt = require('jsonwebtoken')

// document structure define 
const userSchema = new mongoose.Schema({
    employee_id: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    last_name: {
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
    report_to: {
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
    date_of_birth: {
        type: Date,
    },
    joining_date: {
        type: Date,
        required: true
    },
    leaveing_date: {
        type: Date
    },
    blood_group: {
        type: String,
    },
    status: {
        type: String,
        required: true,
        enum: ['Active', 'Inactive']
    },
    profile_image: {
        type: String,
        default: "image_1692858235397.jpg"
    },
    country: {
        type: String,
    },
    state: {
        type: String,
    },
    city: {
        type: String,
    },
    maried_status: {
        type: String,
        enum: ['Married', 'Unmarried']
    },
    postcode: {
        type: Number,
    },
    password: {
        type: String,
        required: true
    },
    role_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    department_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    designation_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    otp: {
        type: Number
    },
    delete_at: {
        type: Date
    },
    expireIn: {
        type: Number
    },
    token: {
        type: String
    }
},
{
    timestamps: true,
}
)

// generate token
userSchema.methods.generateToken = async function () {
    try {
        console.log('this._id :>> ', this._id);
        var token = jwt.sign({ _id: this._id,date: new Date().toLocaleDateString()}, process.env.SECRET_KEY);
        console.log('token :>> ', token);
        this.token = token
        console.log('this.Tokens :>> ', this.Token);
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