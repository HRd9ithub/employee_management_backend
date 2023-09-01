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
const path = require("path")
const { swaggerServe, swaggerSetup } = require('./config');
const emergencyRoute = require('./Routes/emergencyRoute');
const userDocumentRoute = require('./Routes/userDocumentRoute');
const educationRoute = require('./Routes/educationRoute');
const leaveRouter = require('./Routes/leaveRoute');

// const swaggerDocument = require('./swagger.json');
// add database
require("./DB/conn")
// var options = {
//     explorer: true,
//     swaggerOptions: {
//       urls: [
//         {
//           url: 'http://petstore.swagger.io/v2/swagger.json',
//           name: 'Spec1'
//         },
//         {
//           url: 'http://petstore.swagger.io/v2/swagger.json',
//           name: 'Spec2'
//         }
//       ]
//     },
//   }

const app = express();

const port = process.env.PORT || 8000

app.use(cors())

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use('/uploads', express.static(path.join(__dirname, '../uploads/document')))

app.use("/api-docs", swaggerServe, swaggerSetup);

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


app.listen(port,() => {
    console.log(`server is running for ${port}.`)
})

