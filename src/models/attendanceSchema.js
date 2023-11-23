const { Schema, model } = require("mongoose");


const attendanceSchema = new Schema({
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        login_time: {
            type: String,
            required: true
        },
        logout_time: {
            type: String,
            required: false
        },
        totalHours: {
            type: String,
            required: false
        },
    },
    { timestamps: true }
);

const attendance = model("Attendance", attendanceSchema);

module.exports = attendance;
