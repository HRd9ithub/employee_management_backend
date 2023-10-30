require('dotenv').config()
const express = require("express")
var cors = require('cors')
require("./middleware/CreateFolder")
const path = require("path")
var bodyParser = require('body-parser');
const userRoute = require("./Routes/UserRoute");
const AuthRoute = require("./Routes/AuthRoute");
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
const { swaggerServe, swaggerSetup } = require('./config');
const projectRoute = require('./Routes/ProjectRoute')
const workReportRoute = require('./Routes/WorkReportRoute')
const ReportRequestRoute = require('./Routes/reportRequestRoute')

// add database
const connectDB = require("./DB/connection");
const activityRoute = require('./Routes/activityRoute')
const passwordRoute = require('./Routes/PasswordRoute')

const app = express();

const port = process.env.PORT || 8000

app.use(cors())

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }));


app.use(express.json());

// // Register `hbs.engine` with the Express app.
// app.set('view engine', 'handlebars');
// app.set('views', path.join(__dirname, '../views'));



// image get route
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use('/uploads', express.static(path.join(__dirname, '../uploads/document')))
app.use('/uploads', express.static(path.join(__dirname, '../')));

// swagger route
app.use("/api-docs", swaggerServe, swaggerSetup);

// apiu route
app.use('/api/auth', AuthRoute)
app.use('/api/user', userRoute)
app.use('/api/project', projectRoute)
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
app.use('/api/report', workReportRoute)
app.use('/api/report_request', ReportRequestRoute)
app.use('/api/activity', activityRoute)
app.use('/api/password', passwordRoute)

app.all("*", (req, res, next) => {
   let err = new Error(`Can't find ${req.originalUrl} on the server.`);
   err.status = "fail";
   err.statusCode = 404;
   next(err);
});

//An error handling middleware
app.use(function (err, req, res, next) {
   res.status(err.statusCode);
   res.json({ message: err.message, statusCode: err.statusCode })
});

connectDB().then(() => {
   app.listen(port, () => {
      console.log(`server is running for ${port}.`)
  })
}).catch((error) => {
   console.log(error.message);
})
