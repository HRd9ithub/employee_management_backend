require('dotenv').config()
const express = require("express")
const userRoute = require("./Routes/UserRoute");
var bodyParser = require('body-parser');
const AuthRoute = require("./Routes/AuthRoute");
// add database
require("./DB/conn")

const app = express();

const port = process.env.PORT || 8000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/user',userRoute)
app.use('/api/auth',AuthRoute)

// server for listen
app.listen(port,() => {
    console.log(`server is running for ${port}.`)
})