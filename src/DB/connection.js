const mongoose = require("mongoose");

const connectDB = async() => {
    try {
        await mongoose.connect(process.env.URL, {useNewUrlParser: true,useUnifiedTopology: true});
        console.log("Database connect successfully.")

    } catch (error) {
        console.log('error ======================= >>>>>>>>>>>>', error)
    }
}


module.exports = connectDB;