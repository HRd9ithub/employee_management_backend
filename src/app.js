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
const accountRoute = require('./Routes/AccountRoute');
const timeSheetRoute = require('./Routes/timesheetRoute');
const documentRoute = require('./Routes/documentRoute');
const roleRoute = require('./Routes/roleRoute');
// add database
require("./DB/conn")

const app = express();

const port = process.env.PORT || 8000

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/uploads',express.static('uploads'))


app.use('/api/auth',AuthRoute)
app.use('/api/user',userRoute)
app.use('/api/department',departmentRoute)
app.use('/api/designation',designationRoute)
app.use('/api/menu',menuRoute)
app.use('/api/holiday',holidayRoute)
app.use('/api/leaveType',leaveTypeRoute)
app.use('/api/timeSheet',timeSheetRoute)
app.use('/api/document',documentRoute)
app.use('/api/role',roleRoute)



app.use('/api/account',accountRoute)

// server for listen
app.listen(port,() => {
    console.log(`server is running for ${port}.`)
})