const mongoose =require("mongoose");

mongoose.connect('mongodb://localhost:27017/employee_management',{
    useNewUrlParser : true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connect successfully.")
}).catch((err) => {
    console.log('err', err)
})