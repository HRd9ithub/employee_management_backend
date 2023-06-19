require('dotenv').config()
const express = require("express")
var cors = require('cors')
const userRoute = require("./Routes/UserRoute");
var bodyParser = require('body-parser');
const AuthRoute = require("./Routes/AuthRoute");
const departmentRoute = require('./Routes/DepartmentRoute');
const designationRoute = require('./Routes/DesignationRoute');
const menuRoute = require('./Routes/MenuRoute');
const holidayRoute = require('./Routes/HolidayRoute');
const leaveTypeRoute = require('./Routes/leaveTypeRoute');
// add database
require("./DB/conn")

const app = express();

const port = process.env.PORT || 8000

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/auth',AuthRoute)
app.use('/api/user',userRoute)
app.use('/api/department',departmentRoute)
app.use('/api/designation',designationRoute)
app.use('/api/menu',menuRoute)
app.use('/api/holiday',holidayRoute)
app.use('/api/leaveType',leaveTypeRoute)

// server for listen
app.listen(port,() => {
    console.log(`server is running for ${port}.`)
})