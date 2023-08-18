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

const { swaggerServe, swaggerSetup } = require('./config')

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

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/uploads',express.static('uploads'))


app.use("/api-docs", swaggerServe, swaggerSetup); 

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