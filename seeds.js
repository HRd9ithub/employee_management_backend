require('dotenv').config();
require("./src/DB/conn");
const role = require('./src/models/roleSchema');
const user = require('./src/models/UserSchema');
const menu = require('./src/models/menuSchema');
const { default: mongoose } = require('mongoose');


// add database

const menuData = [{
    "name": "Dashboard",
    "path": "/",
},
{
    "name": "Employees",
    "path": "/employees"
},
{
    "name": "Project",
    "path": "/project",
},
{
    "name": "Designation",
    "path": "/designation",
},
{
    "name": "Leave type",
    "path": "/leave-type",
},
{
    "name": "Leaves",
    "path": "/leaves",
},
{
    "name": "Holiday",
    "path": "/holiday",
},
{
    "name": "Timesheet",
    "path": "/time-sheet",
},
{
    "name": "Document",
    "path": "/document",
},
{
    "name": "User Role",
    "path": "/user-role"
},
{
    "name": "Work Report",
    "path": "/work-report",
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


defaultUser().then(() => {
    mongoose.connection.close();
})