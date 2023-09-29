const role = require("../models/roleSchema")

// common role data get
const getRoleData = async (id) => {
    let value = await role.aggregate([
        { $match: { _id: id } },
        {
            $unwind: {
                path: '$permissions',
                preserveNullAndEmptyArrays: true
            }
        },
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
                path: '$permissions.menu',
                preserveNullAndEmptyArrays: true
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

        if (data && data[0].name.toLowerCase() == "admin") {
            permission = data[0]
        } else {
            permission = data.find((val => {
                return val.permissions.menu.name.toLowerCase() == "employees"
            }))
        }

        req.permissions = permission;

        if (permission && permission.name.toLowerCase() === "admin") {
            next()
        } else {
            if (req.method === "POST" && req.route.path == "/") {
                permission.permissions.create !== 0 ? next() : res.status(403).json({ message: "You do not have permission to create Employee." })
            } else if (req.method === "GET" && req.route.path == "/") {
                permission.permissions.list !== 0 ? next() : res.status(403).json({ message: "You don't have permission to listing employee to the Employee Data. please contact admin.", permissions: req.permissions })
            } else if (req.method === "PATCH") {
                permission.permissions.update !== 0 ? next() : res.status(403).json({ message: "You do not have permission to update Employee." })
            } else if (req.method === "DELETE") {
                permission.permissions.delete !== 0 ? next() : res.status(403).json({ message: "You do not have permission to delete Employee." })
            } else if (req.method === "GET" && req.route.path == "/:id") {
                next();
            } else if (req.method === "POST" && req.route.path == "/loginInfo") {
                permission.permissions.list !== 0 ? next() : res.status(403).json({ message: "access denied." })
            }
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
}

// project route check permission
const projectPermission = async (req, res, next) => {
    try {
        let permission = ""
        let data = await getRoleData(req.user.role_id)

        if (data && data[0].name.toLowerCase() == "admin") {
            permission = data[0]
        } else {
            permission = data.find((val => {
                return val.permissions.menu.name.toLowerCase() == "project"
            }))
        }
        req.permissions = permission;

        if (permission.name.toLowerCase() === "admin") {
            next()
        } else {
            if (req.method === "POST" && req.route.path == "/") {
                permission.permissions.create !== 0 ? next() : res.status(403).json({ message: "You do not have permission to create project." })
            } else if (req.method === "GET" && req.route.path == "/") {
                permission.permissions.list !== 0 || req.query.key ? next() : res.status(403).json({ message: "You don't have permission to listing project to the Project Data. please contact admin.", permissions: req.permissions })
            } else if (req.method === "PATCH") {
                permission.permissions.update !== 0 ? next() : res.status(403).json({ message: "You do not have permission to update project." })
            } else if (req.method === "DELETE") {
                permission.permissions.delete !== 0 ? next() : res.status(403).json({ message: "You do not have permission to delete project." })
            }
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
}
// report permission
const reportPermission = async (req, res, next) => {
    try {
        let permission = ""
        let data = await getRoleData(req.user.role_id)

        if (data && data[0].name.toLowerCase() == "admin") {
            permission = data[0]
        } else {
            permission = data.find((val => {
                return val.permissions.menu.name.toLowerCase() == "work report"
            }))
        }
        req.permissions = permission;

        if (permission.name.toLowerCase() === "admin") {
            next()
        } else {
            if (req.method === "POST" && req.route.path == "/") {
                permission.permissions.create !== 0 ? next() : res.status(403).json({ message: "You do not have permission to create work report." })
            } else if (req.method === "GET" && req.route.path == "/") {
                permission.permissions.list !== 0 ? next() : res.status(403).json({ message: "You don't have permission to listing work report to the work report Data. please contact admin.", permissions: req.permissions })
            } else if (req.method === "PATCH") {
                permission.permissions.update !== 0 ? next() : res.status(403).json({ message: "You do not have permission to update work report." })
            } else if (req.method === "DELETE") {
                permission.permissions.delete !== 0 ? next() : res.status(403).json({ message: "You do not have permission to delete work report." })
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

        if (data && data[0].name.toLowerCase() == "admin") {
            permission = data[0]
        } else {
            permission = data.find((val => {
                return val.permissions.menu.name.toLowerCase() == "designation"
            }))
        }

        req.permissions = permission;

        if (permission.name.toLowerCase() === "admin") {
            next()
        } else {
            if (req.method === "POST" && req.route.path == "/") {
                permission.permissions.create !== 0 ? next() : res.status(403).json({ message: "You do not have permission to create designation." })
            } else if (req.method === "GET" && req.route.path == "/") {
                permission.permissions.list !== 0 ? next() : res.status(403).json({ message: "You don't have permission to listing designation to the Designation Data. please contact admin.", permissions: req.permissions })
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
        if (data && data[0].name.toLowerCase() == "admin") {
            permission = data[0]
        } else {
            permission = data.find((val => {
                return val.permissions.menu.name.toLowerCase() == "leaves"
            }))
        }

        req.permissions = permission;

        if (permission.name.toLowerCase() === "admin") {
            next()
        } else {
            if (req.method === "POST" && req.route.path == "/") {
                permission.permissions.create !== 0 ? next() : res.status(403).json({ message: "You do not have permission to create leave." })
            } else if (req.method === "GET" && req.route.path == "/") {
                permission.permissions.list !== 0 ? next() : res.status(403).json({ message: "You don't have permission to listing leave to the leave Data. please contact admin." })
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

        if (data && data[0].name.toLowerCase() == "admin") {
            permission = data[0]
        } else {
            permission = data.find((val => {
                return val.permissions.menu.name.toLowerCase() == "leave type"
            }))
        }

        req.permissions = permission;

        if (permission.name.toLowerCase() === "admin") {
            next()
        } else {
            if (req.method === "POST" && req.route.path == "/") {
                permission.permissions.create !== 0 ? next() : res.status(403).json({ message: "You do not have permission to create leave type." })
            } else if (req.method === "GET" && req.route.path == "/") {
                permission.permissions.list !== 0 || req.query.key ? next() : res.status(403).json({ message: "You don't have permission to listing leave type to the leave type Data. please contact admin." })
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

        if (data && data[0].name.toLowerCase() == "admin") {
            permission = data[0]
        } else {
            permission = data.find((val => {
                return val.permissions.menu.name.toLowerCase() == "holiday"
            }))
        }

        req.permissions = permission;

        if (permission.name.toLowerCase() === "admin") {
            next()
        } else {
            if (req.method === "POST" && req.baseUrl == "/api/holiday") {
                permission.permissions.create !== 0 ? next() : res.status(403).json({ message: "You do not have permission to create holiday." })
            } else if (req.method === "GET" && req.baseUrl == "/api/holiday") {
                permission.permissions.list !== 0 ? next() : res.status(403).json({ message: "You don't have permission to listing holiday to the Holiday Data. please contact admin." })
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

        if (data && data[0].name.toLowerCase() == "admin") {
            permission = data[0]
        } else {
            permission = data.find((val => {
                return val.permissions.menu.name.toLowerCase() == "timesheet"
            }))
        }

        req.permissions = permission;

        if (permission.name.toLowerCase() === "admin") {
            next()
        } else {
            if (req.method === "GET") {
                permission.permissions.list !== 0 ? next() : res.status(403).json({ message: "You don't have permission to listing timesheet to the Timesheet Data. please contact admin." })
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

        if (data && data[0].name.toLowerCase() == "admin") {
            permission = data[0]
        } else {
            permission = data.find((val => {
                return val.permissions.menu.name.toLowerCase() == "document"
            }))
        }

        req.permissions = permission;

        if (permission.name.toLowerCase() === "admin") {
            next()
        } else {
            if (req.method === "POST" && req.baseUrl == "/api/document") {
                permission.permissions.create !== 0 ? next() : res.status(403).json({ message: "You do not have permission to create document." })
            } else if (req.method === "GET" && req.baseUrl == "/api/document") {
                permission.permissions.list !== 0 ? next() : res.status(403).json({ message: "You don't have permission to listing document to the Document Data. please contact admin." })
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

        if (data && data[0].name.toLowerCase() == "admin") {
            permission = data[0]
        } else {
            permission = data.find((val => {
                return val.permissions.menu.name.toLowerCase() == "user role"
            }))
        }

        req.permissions = permission;

        if (permission.name.toLowerCase() === "admin") {
            next()
        } else {
            if (req.method === "POST" && req.baseUrl == "/api/role") {
                permission.permissions.create !== 0 ? next() : res.status(403).json({ message: "You do not have permission to create user role." })
            } else if (req.method === "GET" && req.baseUrl == "/api/role") {
                permission.permissions.list !== 0 ? next() : res.status(403).json({ message: "You don't have permission to listing user role to the User Role Data. please contact admin." })
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

module.exports = { userPermission, rolePermission, projectPermission,reportPermission, designationtPermission, documentPermission, leavePermission, leaveTypePermission, holidayPermission, timesheetPermission }