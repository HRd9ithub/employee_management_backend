const mongoose =require("mongoose");

mongoose.connect(process.env.URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connect successfully.")
}).catch((err) => {
    console.log('err', err)
})