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
        if (data) {
            if(data.token == token){
                req.user = data
                next()
            }else{
                return  res.status(400).json({ message: "Please login try again." })
            }
        }else{
            return  res.status(400).json({ message: "UnAuthorization" })
        }
    } catch (error) {
        res.status(400).json({ message: "UnAuthorization" })
    }
}

module.exports = Auth