const { default: mongoose } = require("mongoose");

const workReportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project",
        required: "Project is a required field."
    },
    description: {
        type: String,
        required: "Description is a required field."
    },
    hours: {
        type: Number,
        required: "Working hours is a required field."
    },
    date: {
        type: String
    }
}, {
    timestamps: true,
})


// create collection
const report = new mongoose.model("report", workReportSchema)

module.exports = report