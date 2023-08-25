const jwt = require("jsonwebtoken");
const user = require("../models/UserSchema");

let verifyUser = ""
const Auth = async (req, res, next) => {
    try {
        let token = req.headers['token'];
        if (token) {
            verifyUser = jwt.verify(token, process.env.SECRET_KEY);
            if (verifyUser.date === new Date().toLocaleDateString()) {
                const data = await user.findOne({ _id: verifyUser._id }).select("-password")
                console.log('user', data)
                if (data) {
                    if (data.token == token && data.status === "Active" && !data.delete_at) {
                        req.user = data
                        next()
                    } else {
                        return res.status(401).json({ message: "Unauthenticated.", success: false })
                    }
                } else {
                    return res.status(401).json({ message: "Unauthenticated.", success: false })
                }
            }
            else {
                return res.status(401).json({ message: "Unauthenticated.", success: false })
            }
        } else {
            return res.status(400).json({ message: "UnAuthorization.", success: false })
        }
        console.log('verifyUser', verifyUser)
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "Internal server error", success: false })
    }
}

module.exports = Auth