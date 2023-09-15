require('dotenv').config()
const express = require("express")
var cors = require('cors')
require("./middleware/CreateFolder")
const path = require("path")
var bodyParser = require('body-parser');
const userRoute = require("./Routes/UserRoute");
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
const emergencyRoute = require('./Routes/emergencyRoute');
const userDocumentRoute = require('./Routes/userDocumentRoute');
const educationRoute = require('./Routes/educationRoute');
const leaveRouter = require('./Routes/leaveRoute');
const DashboardRoute = require('./Routes/DashboardRoute');

// add database
require("./DB/conn")

const app = express();

const port = process.env.PORT || 8000

app.use(cors())

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

// image get route
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use('/uploads', express.static(path.join(__dirname, '../uploads/document')))
app.use('/uploads', express.static(path.join(__dirname, '../')))

// apiu route
app.use('/api/auth', AuthRoute)
app.use('/api/user', userRoute)
app.use('/api/department', departmentRoute)
app.use('/api/designation', designationRoute)
app.use('/api/menu', menuRoute)
app.use('/api/holiday', holidayRoute)
app.use('/api/leaveType', leaveTypeRoute)
app.use('/api/leave', leaveRouter)
app.use('/api/timeSheet', timeSheetRoute)
app.use('/api/document', documentRoute)
app.use('/api/role', roleRoute)
app.use('/api/account', accountRoute)
app.use('/api/emergency', emergencyRoute)
app.use('/api/user_document', userDocumentRoute)
app.use('/api/education', educationRoute)
app.use('/api/dashboard', DashboardRoute)


app.listen(port, () => {
    console.log(`server is running for ${port}.`)
})

