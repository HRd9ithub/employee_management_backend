const role = require("../models/roleSchema")

// common role data get
const getRoleData = async (id) => {
    let value = await role.aggregate([
        { $match: { _id: id } },
        { $unwind: "$permissions" },
        {
            $lookup: {
                from: "menus",
                localField: "permissions.menuId",
                foreignField: "_id",
                as: "permissions.menu"
            }
        },
        {
            $unwind: {
                path: '$permissions.menu'
            }
        }
    ])

    return value
}

// user route permission check
const userPermission = async (req, res, next) => {
    try {
        let permission = ""
        let data = await getRoleData(req.user.role_id)

        permission = data.find((val => {
            return val.permissions.menu.name.toLowerCase() == "employee"
        }))

        if (!permission) {
            permission = await role.findById({ _id: req.user.role_id })
        }
        req.permissions = permission;


        if (!permission || permission.name.toLowerCase() === "admin") {
            next()
        } else {
            if (req.method === "POST" && req.route.path == "/") {
                permission.permissions.create !== 0 ? next() : res.status(403).json({ message: "You do not have permission to create user." })
            } else if (req.method === "GET" && req.route.path == "/") {
                permission.permissions.list !== 0 ? next() : res.status(403).json({ message: "You do not have permission to view user list." })
            } else if (req.method === "PATCH") {
                permission.permissions.update !== 0 ? next() : res.status(403).json({ message: "You do not have permission to update user." })
            } else if (req.method === "DELETE") {
                permission.permissions.delete !== 0 ? next() : res.status(403).json({ message: "You do not have permission to delete user." })
            } else if (req.method === "POST" && (req.route.path == "/loginInfo" || req.route.path == "/username")) {
                permission.permissions.list !== 0 ? next() : res.status(403).json({ message: "access denied." })
            }
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
}

// department route check permission
const departmentPermission = async (req, res, next) => {
    try {
        let permission = ""
        let data = await getRoleData(req.user.role_id)

        permission = data.find((val => {
            return val.permissions.menu.name.toLowerCase() == "department"
        }))

        if (!permission) {
            permission = await role.findById({ _id: req.user.role_id })
        }
        req.permissions = permission;

        if (permission.name.toLowerCase() === "admin") {
            next()
        } else {
            if (req.method === "POST" && req.route.path == "/") {
                permission.permissions.create !== 0 ? next() : res.status(403).json({ message: "You do not have permission to create department." })
            } else if (req.method === "GET" && req.route.path == "/") {
                permission.permissions.list !== 0 ? next() : res.status(403).json({ message: "You do not have permission to view department list." })
            } else if (req.method === "PATCH") {
                permission.permissions.update !== 0 ? next() : res.status(403).json({ message: "You do not have permission to update department." })
            } else if (req.method === "DELETE") {
                permission.permissions.delete !== 0 ? next() : res.status(403).json({ message: "You do not have permission to delete department." })
            }
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
}

// designation route check permission
const designationtPermission = async (req, res, next) => {
    try {
        let permission = ""
        let data = await getRoleData(req.user.role_id)

        permission = data.find((val => {
            return val.permissions.menu.name.toLowerCase() == "designation"
        }))

        if (!permission) {
            permission = await role.findById({ _id: req.user.role_id })
        }
        req.permissions = permission;

        if (permission.name.toLowerCase() === "admin") {
            next()
        } else {
            if (req.method === "POST" && req.route.path == "/") {
                permission.permissions.create !== 0 ? next() : res.status(403).json({ message: "You do not have permission to create designation." })
            } else if (req.method === "GET" && req.route.path == "/") {
                permission.permissions.list !== 0 ? next() : res.status(403).json({ message: "You do not have permission to view designation list." })
            } else if (req.method === "PATCH") {
                permission.permissions.update !== 0 ? next() : res.status(403).json({ message: "You do not have permission to update designation." })
            } else if (req.method === "DELETE") {
                permission.permissions.delete !== 0 ? next() : res.status(403).json({ message: "You do not have permission to delete designation." })
            }
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
}

// leave route check permission
const leavePermission = async (req, res, next) => {
    try {
        let permission = ""
        let data = await getRoleData(req.user.role_id)
        permission = data.find((val => {
            return val.permissions.menu.name.toLowerCase() == "leaves"
        }))

        console.log(permission, "permission")
        if (!permission) {
            permission = await role.findById({ _id: req.user.role_id })
        }
        req.permissions = permission;

        if (permission.name.toLowerCase() === "admin") {
            next()
        } else {
            console.log(req.route)
            if (req.method === "POST" && req.route.path == "/") {
                permission.permissions.create !== 0 ? next() : res.status(403).json({ message: "You do not have permission to create leave." })
            } else if (req.method === "GET" && req.route.path == "/") {
                permission.permissions.list !== 0 ? next() : res.status(403).json({ message: "You do not have permission to view leave list." })
            } else if (req.method === "PATCH" || req.method === "PUT" || (req.method === "POST" && req.route.path === "/status")) {
                permission.permissions.update !== 0 ? next() : res.status(403).json({ message: "You do not have permission to update leave." })
            }
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
}

// leave type route check permission
const leaveTypePermission = async (req, res, next) => {
    try {
        let permission = ""
        let data = await getRoleData(req.user.role_id)

        permission = data.find((val => {
            return val.permissions.menu.name.toLowerCase() == "leave type"
        }))

        if (!permission) {
            permission = await role.findById({ _id: req.user.role_id })
        }
        req.permissions = permission;

        if (permission.name.toLowerCase() === "admin") {
            next()
        } else {
            if (req.method === "POST" && req.route.path == "/") {
                permission.permissions.create !== 0 ? next() : res.status(403).json({ message: "You do not have permission to create leave type." })
            } else if (req.method === "GET" && req.route.path == "/") {
                next()
                // permission.permissions.list !== 0 ? next() : res.status(403).json({ message: "You do not have permission to view leave type list." })
            } else if (req.method === "PATCH") {
                permission.permissions.update !== 0 ? next() : res.status(403).json({ message: "You do not have permission to update leave type." })
            } else if (req.method === "DELETE") {
                permission.permissions.delete !== 0 ? next() : res.status(403).json({ message: "You do not have permission to delete leave type." })
            }
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
}


// holiday route check permission
const holidayPermission = async (req, res, next) => {
    try {
        let permission = ""
        let data = await getRoleData(req.user.role_id)

        permission = data.find((val => {
            return val.permissions.menu.name.toLowerCase() == "holiday"
        }))

        if (!permission) {
            permission = await role.findById({ _id: req.user.role_id })
        }
        req.permissions = permission;

        if (permission.name.toLowerCase() === "admin") {
            next()
        } else {
            if (req.method === "POST" && req.baseUrl == "/api/holiday") {
                permission.permissions.create !== 0 ? next() : res.status(403).json({ message: "You do not have permission to create holiday." })
            } else if (req.method === "GET" && req.baseUrl == "/api/holiday") {
                permission.permissions.list !== 0 ? next() : res.status(403).json({ message: "You do not have permission to view holiday list." })
            } else if (req.method === "PUT") {
                permission.permissions.update !== 0 ? next() : res.status(403).json({ message: "You do not have permission to update holiday." })
            } else if (req.method === "DELETE") {
                permission.permissions.delete !== 0 ? next() : res.status(403).json({ message: "You do not have permission to delete holiday." })
            }
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
}

// timesheet route check permission
const timesheetPermission = async (req, res, next) => {
    try {
        let permission = ""
        let data = await getRoleData(req.user.role_id)

        permission = data.find((val => {
            return val.permissions.menu.name.toLowerCase() == "timesheet"
        }))

        if (!permission) {
            permission = await role.findById({ _id: req.user.role_id })
        }
        req.permissions = permission;

        if (permission.name.toLowerCase() === "admin") {
            next()
        } else {
            if (req.method === "GET") {
                permission.permissions.list !== 0 ? next() : res.status(403).json({ message: "You do not have permission to view timeSheet list." })
            }
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
}

// document route check permission
const documentPermission = async (req, res, next) => {
    try {
        let permission = ""
        let data = await getRoleData(req.user.role_id)

        permission = data.find((val => {
            return val.permissions.menu.name.toLowerCase() == "document"
        }))

        if (!permission) {
            permission = await role.findById({ _id: req.user.role_id })
        }
        req.permissions = permission;

        if (permission.name.toLowerCase() === "admin") {
            next()
        } else {
            if (req.method === "POST" && req.baseUrl == "/api/document") {
                permission.permissions.create !== 0 ? next() : res.status(403).json({ message: "You do not have permission to create document." })
            } else if (req.method === "GET" && req.baseUrl == "/api/document") {
                permission.permissions.list !== 0 ? next() : res.status(403).json({ message: "You do not have permission to view document list." })
            } else if (req.method === "PUT") {
                permission.permissions.update !== 0 ? next() : res.status(403).json({ message: "You do not have permission to update document." })
            } else if (req.method === "DELETE") {
                permission.permissions.delete !== 0 ? next() : res.status(403).json({ message: "You do not have permission to delete document." })
            }
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
}

// role route check permission
const rolePermission = async (req, res, next) => {
    try {
        let permission = ""
        let data = await getRoleData(req.user.role_id)

        permission = data.find((val => {
            return val.permissions.menu.name.toLowerCase() == "user role"
        }))

        if (!permission) {
            permission = await role.findById({ _id: req.user.role_id })
        }
        req.permissions = permission;

        if (permission.name.toLowerCase() === "admin") {
            next()
        } else {
            if (req.method === "POST" && req.baseUrl == "/api/role") {
                permission.permissions.create !== 0 ? next() : res.status(403).json({ message: "You do not have permission to create user role." })
            } else if (req.method === "GET" && req.baseUrl == "/api/role") {
                permission.permissions.list !== 0 ? next() : res.status(403).json({ message: "You do not have permission to view user role list." })
            } else if (req.method === "PUT") {
                permission.permissions.update !== 0 ? next() : res.status(403).json({ message: "You do not have permission to update user role." })
            } else if (req.method === "DELETE") {
                permission.permissions.delete !== 0 ? next() : res.status(403).json({ message: "You do not have permission to delete user role." })
            }
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
}

module.exports = { userPermission, rolePermission, departmentPermission, designationtPermission, documentPermission, leavePermission, leaveTypePermission, holidayPermission, timesheetPermission }