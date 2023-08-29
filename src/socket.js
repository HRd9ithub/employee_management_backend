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
const user = require('./models/UserSchema');
const jwt = require("jsonwebtoken");
// const http = require("http")
// const {Server} = require('socket.io')
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

// const server = http.createServer(app)

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json())

//New imports
const http = require("http").Server(app);
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
app.use('/api/timeSheet', timeSheetRoute)
app.use('/api/document', documentRoute)
app.use('/api/role', roleRoute)
app.use('/api/account', accountRoute)
app.use('/api/emergency', emergencyRoute)
app.use('/api/user_document', userDocumentRoute)
app.use('/api/education', educationRoute)

const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3001"
    }
});

//Add this before the app.get() block
socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);
    socket.on("send", async(data) => {
        console.log(data)
        verifyUser = jwt.verify(data.message, process.env.SECRET_KEY);
            if (verifyUser.date === new Date().toLocaleDateString()) {
                const data = await user.findOne({ _id: verifyUser._id }).select("-password")
                console.log('user', data)
                if (data) {
                    if (!data.token) {
                        socket.emit("receive",{isAuth : false})
                    }else{
                        socket.emit("receive",{isAuth : true})
                    }
                }
            }
    })

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
    });
});

// server for listen
//  server.listen(port,() => {
//     console.log(`server is running for ${port}.`)
// })
http.listen(port, () => {
    console.log(`Server listening on ${port}`);
});
// const server = app.listen(port,() => {
//     console.log(`server is running for ${port}.`)
// })

