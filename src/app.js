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
var handlebars = require('express-handlebars');
const user = require('./models/UserSchema')

// add database
require("./DB/conn")

const app = express();

const port = process.env.PORT || 8000

app.use(cors())

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }));


const http = require("http").Server(app);


app.use(express.json());

// Register `hbs.engine` with the Express app.
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));



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


//  app.listen(port, () => {
//     console.log(`server is running for ${port}.`)
// })

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});
let users = [];

socketIO.on('connection', (socket) => {
    socket.on("set", (data) => {
        let record = users.filter((val) => {
            return val.email === data.userId
        })

        if (record.length > 0) {
            users = users.filter((elem) => elem.email != data.userId)
        }
        users.push({ key: socket.id, email: data.userId })
    })
    socket.on('login', function (data) {
        let record = users.find((val) => {
            return val.email === data.userId
        })

        if (record) {
            socket.to(record.key).emit('receive', { isAuth: true })
            users = users.filter((elem) => elem.email != data.userId)
        }
        users.push({ key: socket.id, email: data.userId })
    });

    socket.on('status', async function (data) {
        let record = users.find((val) => {
            return val.email === data.userId
        })
        let userRecord = await user.findOne({ email: data.userId });

        if (userRecord.status === "Inactive") {
            socket.to(record.key).emit('receive', { isAuth: true })
        }
    });
    socket.on('disconnect', () => {
        users = users.filter((elem) => elem.key != socket.id)
        console.log('🔥: A user disconnected');
    });
});



// io.on("connection", socket => {
//     console.log(socket)
// })

http.listen(port, () => {
    console.log(`Server listening on ${port}`);
});