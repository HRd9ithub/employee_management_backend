const jwt = require("jsonwebtoken");
const user = require("../models/UserSchema")

const Auth = async (req, res, next) => {
    try {
        let token = req.headers['token'];
        console.log('token', token)
        let verifyUser = jwt.verify(token, process.env.SECRET_KEY)
        console.log('verifyUser', verifyUser)
        const data = await user.findOne({ _id: verifyUser._id }).select("-password")
        console.log('user', data)
        req.user = data
        next()
    } catch (error) {
        res.status(404).send("UnAuthorization")
    }
}

module.exports =Auth