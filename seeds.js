require('dotenv').config();
const role = require('./src/models/roleSchema');
const user = require('./src/models/UserSchema');
const menu = require('./src/models/menuSchema');
const { default: mongoose } = require('mongoose');
const connectDB = require("./src/DB/connection");

// add database

const menuData = [{
    "name": "Dashboard",
    "path": "/",
    "icon": "fa-solid fa-house"
},
{
    "name": "Employees",
    "path": "/employees",
    "icon": "fa-solid fa-user"
},
{
    "name": "Project",
    "path": "/project",
    "icon": "fa-solid fa-user"
},
{
    "name": "Designation",
    "path": "/designation",
    "icon": "fa-solid fa-user"
},
{
    "name": "Leave Type",
    "path": "/leave-type",
    "icon": "fa-solid fa-calendar"
},
{
    "name": "Leaves",
    "path": "/leaves",
    "icon": "fa-solid fa-calendar"
},
{
    "name": "Holiday",
    "path": "/holiday",
    "icon": "fa-solid fa-calendar"
},
{
    "name": "Timesheet",
    "path": "/time-sheet",
    "icon": "fa-solid fa-clock"
},
{
    "name": "Activity Logs",
    "path": "/activity",
    "icon": "fa-solid fa-clock-rotate-left"
},
{
    "name": "Document",
    "path": "/documents",
    "icon": "fa-solid fa-book"
},
{
    "name": "User Role",
    "path": "/user-role",
    "icon": "fa-solid fa-gear"
},
{
    "name": "Work Report",
    "path": "/work-report",
    "icon": "fa-solid fa-gear"
},
{
    "name": "Password",
    "path": "/password",
    "icon": "fa-solid fa-gear"
}]

const defaultUser = async () => {
    try {
        const roleData = new role({
            name: "Admin",
            permissions: []
        });

        const response = await roleData.save();
        if(response){
            const userData = new user({
                employee_id: "D9-01",
                first_name: "Admin",
                last_name: "Admin",
                email: "hardik.d9ithub@gmail.com",
                phone: "7894561230",
                joining_date: "2023-10-01",
                status: "Active",
                password: "Admin@123",
                role_id: response._id,
            });
            const abc = await userData.save();
            if (abc) {
                console.log("Successfully created.")
            }
            let data = await menu.insertMany(menuData)
        }
    } catch (error) {
        console.log('error', error)
    }
}


connectDB().then(() => {
    defaultUser().then(() => {
        mongoose.connection.close();
    })
})
